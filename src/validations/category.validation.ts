import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        error: 'Category name is required',
      })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters'),
    description: z
      .string({ error: 'Description must be a string' })
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z
      .string({ error: 'Category ID is required' })
      .regex(/^\d+$/, 'ID must be a positive integer'),
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
      description: z
        .string()
        .trim()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field (name or description) must be provided for update',
    }),
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ error: 'Category ID is required' })
      .regex(/^\d+$/, 'ID must be a positive integer'),
  }),
});