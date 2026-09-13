import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
} from '../validations/order.validation.js';

const router = Router();

router
  .route('/')
  .post(validate(createOrderSchema), OrderController.createOrder)
  .get(OrderController.getAllOrders);

router
  .route('/:id')
  .get(validate(orderIdParamSchema), OrderController.getOrderById);

router
  .route('/:id/status')
  .patch(validate(updateOrderStatusSchema), OrderController.updateOrderStatus);

export const orderRoutes = router;