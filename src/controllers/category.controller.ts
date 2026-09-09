import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';
import { ICategory } from '../types/category.types.js';

const categoryService = new CategoryService();

export class CategoryController {
  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse<ICategory>(res, {
      statusCode: 201,
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  });

  static getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();

    sendResponse<ICategory[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Categories fetched successfully',
      meta: {
        total: result.length,
      },
      data: result,
    });
  });

  static getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await categoryService.getCategoryById(id);

    sendResponse<ICategory>(res, {
      statusCode: 200,
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await categoryService.updateCategory(id, req.body);

    sendResponse<ICategory>(res, {
      statusCode: 200,
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    await categoryService.deleteCategory(id);

    sendResponse<null>(res, {
      statusCode: 200,
      success: true,
      message: 'Category deleted successfully',
      data: null,
    });
  });
}