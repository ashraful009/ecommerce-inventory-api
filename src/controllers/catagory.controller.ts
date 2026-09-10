import { Request, Response } from 'express';
import { CatagoryService } from '../services/catagory.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';
import { ICatagory } from '../types/catagory.types.js';

const catagoryService = new CatagoryService();

export class CatagoryController {
  static createCatagory = catchAsync(async (req: Request, res: Response) => {
    const result = await catagoryService.createCatagory(req.body);

    sendResponse<ICatagory>(res, {
      statusCode: 201,
      success: true,
      message: 'Catagory created successfully',
      data: result,
    });
  });

  static getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await catagoryService.getAllCategories();

    sendResponse<ICatagory[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Categories fetched successfully',
      meta: {
        total: result.length,
      },
      data: result,
    });
  });

  static getCatagoryById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await catagoryService.getCatagoryById(id);

    sendResponse<ICatagory>(res, {
      statusCode: 200,
      success: true,
      message: 'Catagory retrieved successfully',
      data: result,
    });
  });

  static updateCatagory = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await catagoryService.updateCatagory(id, req.body);

    sendResponse<ICatagory>(res, {
      statusCode: 200,
      success: true,
      message: 'Catagory updated successfully',
      data: result,
    });
  });

  static deleteCatagory = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    await catagoryService.deleteCatagory(id);

    sendResponse<null>(res, {
      statusCode: 200,
      success: true,
      message: 'Catagory deleted successfully',
      data: null,
    });
  });
}