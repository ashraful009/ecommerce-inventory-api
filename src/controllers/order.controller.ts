import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';
import { IOrder, IOrderDetail } from '../types/order.types.js';

const orderService = new OrderService();

export class OrderController {
  // POST /api/v1/orders
  static createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await orderService.createOrder(req.body);

    sendResponse<IOrderDetail>(res, {
      statusCode: 201,
      success: true,
      message: 'Order placed successfully and inventory updated',
      data: result,
    });
  });

  // GET /api/v1/orders
  static getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await orderService.getAllOrders();

    sendResponse<IOrder[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Orders retrieved successfully',
      meta: {
        total: result.length,
      },
      data: result,
    });
  });

  // GET /api/v1/orders/:id
  static getOrderById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await orderService.getOrderById(id);

    sendResponse<IOrderDetail>(res, {
      statusCode: 200,
      success: true,
      message: 'Order retrieved successfully',
      data: result,
    });
  });

  // PATCH /api/v1/orders/:id/status
  static updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const { status } = req.body;
    const result = await orderService.updateOrderStatus(id, status);

    sendResponse<IOrder>(res, {
      statusCode: 200,
      success: true,
      message: `Order status updated to '${status}' successfully`,
      data: result,
    });
  });
}