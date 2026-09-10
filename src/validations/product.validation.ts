import { z } from 'zod'

export const createProductSchema = z.object({
    body: z.object({
        catagory_id: z.number({error: 'catagory_id is required'}).int().positive(),
        title: z.string({error: 'Product title is required'}).trim().min(2, '2 characters').max(200, '200 characters'),
        description: z.string({}).trim().min(2, '2 characters').max(200, '200 characters'),
        price: z.number({error: 'Price is required'}).nonnegative(),
        stock: z.number({error: 'Stock count is required'}).int().nonnegative()
    })
    
})

export const productIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ error: 'Product ID is required' })
      .regex(/^\d+$/, 'ID must be a positive integer'),
  }),
});

export const updateProductSchema = z.object({
params: z.object({
    id: z
      .string({ error: 'Product ID is required' })
      .regex(/^\d+$/, 'ID must be a positive integer'),
  }),
    body: z.object({
        catagory_id: z.number({error: 'catagory_id is required'}).int().positive(),
        title: z.string({error: 'Product title is required'}).trim().min(2, '2 characters').max(200, '200 characters'),
        description: z.string({}).trim().min(2, '2 characters').max(200, '200 characters'),
        price: z.number({error: 'Price is required'}).nonnegative(),
        stock: z.number({error: 'Stock count is required'}).int().nonnegative()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
})

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    searchTerm: z.string().trim().optional(),
    catagory_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    sortBy: z.enum(['price', 'created_at', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});