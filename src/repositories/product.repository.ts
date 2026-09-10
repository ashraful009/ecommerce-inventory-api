import { pool } from '../config/db.js';
import {
  IProduct,
  IProductWithCatagory,
  ICreateProductPayload,
  IUpdateProductPayload,
  IProductQueryParams,
} from '../types/product.types.js';

export class ProductRepository {
  // Create a new product
  async create(payload: ICreateProductPayload): Promise<IProduct> {
    const query = `
      INSERT INTO products (catagory_id, title, description, price, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, catagory_id, title, description, price, stock, created_at;
    `;
    const values = [
      payload.catagory_id,
      payload.title,
      payload.description || null,
      payload.price,
      payload.stock,
    ];

    const { rows } = await pool.query<IProduct>(query, values);
    return rows[0];
  }

  // Find all products with dynamic search, filter, sort, pagination and catagory JOIN
  async findAll(params: IProductQueryParams): Promise<{ products: IProductWithCatagory[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      searchTerm,
      catagoryId,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let counter = 1;

    // Search by title or description
    if (searchTerm) {
      conditions.push(`(p.title ILIKE $${counter} OR p.description ILIKE $${counter})`);
      values.push(`%${searchTerm}%`);
      counter++;
    }

    // Filter by Catagory
    if (catagoryId) {
      conditions.push(`p.catagory_id = $${counter}`);
      values.push(catagoryId);
      counter++;
    }

    // Filter by Price Range
    if (minPrice !== undefined) {
      conditions.push(`p.price >= $${counter}`);
      values.push(minPrice);
      counter++;
    }

    if (maxPrice !== undefined) {
      conditions.push(`p.price <= $${counter}`);
      values.push(maxPrice);
      counter++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Allowed sort columns to prevent SQL injection
    const allowedSortFields = ['price', 'created_at', 'title'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? `p.${sortBy}` : 'p.created_at';
    const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Count total query
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM products p
      ${whereClause};
    `;
    const countResult = await pool.query<{ total: number }>(countQuery, values);
    const total = countResult.rows[0]?.total || 0;

    // Main Data query with JOIN
    const dataQuery = `
      SELECT 
        p.id,
        p.catagory_id,
        c.name AS catagory_name,
        p.title,
        p.description,
        p.price::float AS price,
        p.stock,
        p.created_at
      FROM products p
      INNER JOIN catagories c ON p.catagory_id = c.id
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${counter++} OFFSET $${counter};
    `;
    values.push(limit, offset);

    const { rows: products } = await pool.query<IProductWithCatagory>(dataQuery, values);

    return { products, total };
  }

  // Find single product by ID with catagory info
  async findById(id: number): Promise<IProductWithCatagory | null> {
    const query = `
      SELECT 
        p.id,
        p.catagory_id,
        c.name AS catagory_name,
        p.title,
        p.description,
        p.price::float AS price,
        p.stock,
        p.created_at
      FROM products p
      INNER JOIN categories c ON p.catagory_id = c.id
      WHERE p.id = $1;
    `;
    const { rows } = await pool.query<IProductWithCatagory>(query, [id]);
    return rows[0] || null;
  }

  // Update product dynamically
  async update(id: number, payload: IUpdateProductPayload): Promise<IProduct | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let counter = 1;

    if (payload.catagory_id !== undefined) {
      fields.push(`catagory_id = $${counter++}`);
      values.push(payload.catagory_id);
    }

    if (payload.title !== undefined) {
      fields.push(`title = $${counter++}`);
      values.push(payload.title);
    }

    if (payload.description !== undefined) {
      fields.push(`description = $${counter++}`);
      values.push(payload.description);
    }

    if (payload.price !== undefined) {
      fields.push(`price = $${counter++}`);
      values.push(payload.price);
    }

    if (payload.stock !== undefined) {
      fields.push(`stock = $${counter++}`);
      values.push(payload.stock);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${counter}
      RETURNING id, catagory_id, title, description, price, stock, created_at;
    `;

    const { rows } = await pool.query<IProduct>(query, values);
    return rows[0] || null;
  }

  // Delete product
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM products
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}