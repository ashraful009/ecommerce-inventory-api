import { OrderRepository } from "../repositories/order.repository.js";
import {
  ICreateOrderPayload,
  IOrder,
  IOrderDetail,
  OrderStatus,
} from "../types/order.types.js";
import { AppError } from "../utils/appError.js";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(payload: ICreateOrderPayload): Promise<IOrderDetail> {
    const productIds = payload.items.map((item) => item.product_id);
    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      throw new AppError(
        "Duplicate products detected in order payload. Please combine quantities for the same product",
        400,
      );
    }
    return await this.orderRepository.createOrderWithTransaction(payload);
  }

  async getAllOrders(): Promise<IOrder[]> {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id: number): Promise<IOrderDetail> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new AppError(`Order with ID ${id} not found`, 404);
    }
    return order;
  }

  async updateOrderStatus(id: number, newStatus: OrderStatus): Promise<IOrder> {
    const existingOrder = await this.getOrderById(id);
    if (existingOrder.status === newStatus) {
      throw new AppError(`Order status is already set to '${newStatus}'`, 400);
    }
    if (existingOrder.status === "completed") {
      throw new AppError(`Order status complete'`, 400);
    }
    if (existingOrder.status === "cancelled") {
      throw new AppError(`Order status cancel '`, 400);
    }
    if (newStatus === "cancelled") {
      return await this.orderRepository.cancelOrderWithTransaction(id);
    }

    const updatedOrder = await this.orderRepository.updateStatus(id, newStatus);
    if (!updatedOrder) {
      throw new AppError(
        `Failed to update status for order with ID ${id}`,
        500,
      );
    }

    return updatedOrder;
  }
}
