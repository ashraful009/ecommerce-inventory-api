import { email, z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Name required' }).trim().min(2, '2 char').max(200, '200 char'),
    email: z.string({ error: 'email required' }).trim().email('invalid email'),
    role: z.enum(['customer', 'admin'], { message: 'invalid role' }).optional(),
  }),
})

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string({error: 'User id required'}).regex(/^\d+$/, 'Id positive intiger'),
        
    }),
    body: z.object({
        name:z.string().trim().max(200).optional(),
        email:z.string().trim().email('invalid email'),
        role: z.enum(['customer | admin']).optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        error: 'at least one field must me required'
    })
})

export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string({error: 'user id required'}).regex(/^\d+$/, "Id positive")
    }),
});
