import { pool } from '../config/db.js';
import {
  IOrder,
  IOrderDetail,
  IOrderItemDetail,
  ICreateOrderPayload,
  OrderStatus,
} from '../types/order.types.js';
import { AppError } from '../utils/appError.js';

export class OrderRepository {
  // Create Order with Transaction & Row-level Locking
  async createOrderWithTransaction(payload: ICreateOrderPayload): Promise<IOrderDetail> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. ইউজার এক্সিস্ট করে কিনা চেক করা
      const userRes = await client.query(
        'SELECT id, name, email FROM users WHERE id = $1;',
        [payload.user_id]
      );
      if (userRes.rows.length === 0) {
        throw new AppError(`User with ID ${payload.user_id} not found`, 404);
      }
      const user = userRes.rows[0];

      let totalAmount = 0;
      const verifiedItems: {
        product_id: number;
        product_title: string;
        quantity: number;
        unit_price: number;
      }[] = [];

      // 2. প্রতিটি আইটেমের স্টক ভেরিফাই ও লক করা (FOR UPDATE)
      for (const item of payload.items) {
        const productRes = await client.query<{
          id: number;
          title: string;
          price: number;
          stock: number;
        }>(
          'SELECT id, title, price::float AS price, stock FROM products WHERE id = $1 FOR UPDATE;',
          [item.product_id]
        );

        if (productRes.rows.length === 0) {
          throw new AppError(`Product with ID ${item.product_id} not found`, 404);
        }

        const product = productRes.rows[0];

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for '${product.title}'. Requested: ${item.quantity}, Available: ${product.stock}`,
            400
          );
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        verifiedItems.push({
          product_id: product.id,
          product_title: product.title,
          quantity: item.quantity,
          unit_price: product.price,
        });

        // স্টক ডিডাক্ট করা
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2;',
          [item.quantity, product.id]
        );
      }

      // 3. অর্ডার এন্ট্রি তৈরি করা
      const orderRes = await client.query<IOrder>(
        `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, 'pending')
        RETURNING id, user_id, total_amount::float AS total_amount, status, created_at;
        `,
        [payload.user_id, totalAmount]
      );
      const order = orderRes.rows[0];

      // 4. অর্ডার আইটেমস ইনসার্ট করা
      const orderItems: IOrderItemDetail[] = [];
      for (const item of verifiedItems) {
        const itemRes = await client.query(
          `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
          RETURNING id, order_id, product_id, quantity, unit_price::float AS unit_price, created_at;
          `,
          [order.id, item.product_id, item.quantity, item.unit_price]
        );

        orderItems.push({
          ...itemRes.rows[0],
          product_title: item.product_title,
        });
      }

      await client.query('COMMIT');

      return {
        ...order,
        customer_name: user.name,
        customer_email: user.email,
        items: orderItems,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // সব অর্ডার ফেচ করা (সহজ দেখার জন্য কাস্টমার ইনফো সহ)
  async findAll(): Promise<IOrder[]> {
    const query = `
      SELECT 
        o.id,
        o.user_id,
        o.total_amount::float AS total_amount,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC;
    `;
    const { rows } = await pool.query<IOrder>(query);
    return rows;
  }

  // অর্ডার বিস্তারিত (Order + Items + Customer Info)
  async findById(id: number): Promise<IOrderDetail | null> {
    const orderQuery = `
      SELECT 
        o.id,
        o.user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        o.total_amount::float AS total_amount,
        o.status,
        o.created_at
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
      WHERE o.id = $1;
    `;
    const orderRes = await pool.query(orderQuery, [id]);
    if (orderRes.rows.length === 0) return null;

    const itemsQuery = `
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        p.title AS product_title,
        oi.quantity,
        oi.unit_price::float AS unit_price,
        oi.created_at
      FROM order_items oi
      INNER JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1;
    `;
    const itemsRes = await pool.query<IOrderItemDetail>(itemsQuery, [id]);

    return {
      ...orderRes.rows[0],
      items: itemsRes.rows,
    };
  }

  // অর্ডারের স্ট্যাটাস আপডেট করা
  async updateStatus(id: number, status: OrderStatus): Promise<IOrder | null> {
    const query = `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, user_id, total_amount::float AS total_amount, status, created_at;
    `;
    const { rows } = await pool.query<IOrder>(query, [status, id]);
    return rows[0] || null;
  }

  // অর্ডার ক্যান্সেল হলে স্টক রিস্টোর করার ট্রানজ্যাকশন
  async cancelOrderWithTransaction(id: number): Promise<IOrder> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderRes = await client.query<IOrder>(
        'SELECT id, status FROM orders WHERE id = $1 FOR UPDATE;',
        [id]
      );
      if (orderRes.rows.length === 0) {
        throw new AppError(`Order with ID ${id} not found`, 404);
      }

      if (orderRes.rows[0].status === 'cancelled') {
        throw new AppError('Order is already cancelled', 400);
      }

      // অর্ডারের আইটেমগুলো নিয়ে আসা
      const itemsRes = await client.query<{ product_id: number; quantity: number }>(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1;',
        [id]
      );

      // প্রতি প্রোডাক্টের স্টক পুনরায় বৃদ্ধি (Restore) করা
      for (const item of itemsRes.rows) {
        await client.query(
          'UPDATE products SET stock = stock + $1 WHERE id = $2;',
          [item.quantity, item.product_id]
        );
      }

      // স্ট্যাটাস 'cancelled'-এ রূপান্তর
      const updatedOrder = await client.query<IOrder>(
        `
        UPDATE orders
        SET status = 'cancelled'
        WHERE id = $1
        RETURNING id, user_id, total_amount::float AS total_amount, status, created_at;
        `,
        [id]
      );

      await client.query('COMMIT');
      return updatedOrder.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}