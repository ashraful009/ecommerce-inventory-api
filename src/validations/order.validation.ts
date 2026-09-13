import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    user_id: z
      .number({
        error: 'user_id is required',
      })
      .int()
      .positive('user_id must be a positive integer'),
    items: z
      .array(
        z.object({
          product_id: z
            .number({
              error: 'product_id is required',
            })
            .int()
            .positive('product_id must be a positive integer'),
          quantity: z
            .number({
              error: 'quantity is required',

            })
            .int('Quantity must be an integer')
            .positive('Quantity must be at least 1'),
        }),
        { error: 'Order items are required' }
      )
      .nonempty('At least one item is required to create an order'),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z
      .string({ error: 'Order ID is required' })
      .regex(/^\d+$/, 'ID must be a positive integer'),
  }),
  body: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'cancelled'], {
      error: 'Status is required',
    }),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ error: 'Order ID is required' })
      .regex(/^\d+$/, 'ID must be a positive integer'),
  }),
});