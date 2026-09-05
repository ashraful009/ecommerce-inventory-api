
import express, { Application, Request, Response } from "express";
import cors from 'cors'
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/appError.js';
const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/health', (req: Request, res: Response) => {
res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running'
});
});

app.all('*splat', (req: Request, res: Response, next) => {
  next(new AppError(`Cannot find route: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;