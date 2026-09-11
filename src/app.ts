import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/appError.js';
import { catagoryRoutes } from './routes/catagory.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { userRoutes } from './routes/user.routes.js';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running',
  });
});

// Application Routes
app.use('/api/v1/categories', catagoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Handle 404 Routes
app.all('*splat', (req: Request, res: Response, next) => {
  next(new AppError(`Cannot find route: ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;