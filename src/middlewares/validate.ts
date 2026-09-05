import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AnyZodObject } from 'zod/v3';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(' Incoming Request Data:');
      console.log('Body:', req.body);
      console.log('Query:', req.query);
      console.log('Params:', req.params);
      console.log(' Validation Schema:', schema);
      await schema.parseAsync({
        
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.').replace(/^(body|query|params)\.?/, ''),
            message: issue.message,
          })),
        });
        return;
      }
      next(error);
    }
  };