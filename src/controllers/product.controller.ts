import { ProductService } from "../services/product.service.js";
import {
  IProduct,
  IProductQueryParams,
  IProductWithCatagory,
} from "../types/product.types.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/sendResponse.js";
import { Request, Response } from "express";

const productService = new ProductService();



export class ProductController {
  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await productService.createProduct(req.body);

    sendResponse<IProduct>(res, {
      statusCode: 201,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  });

  static getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const queryParams: IProductQueryParams =
      req.query as unknown as IProductQueryParams;
    const { products, meta } = await productService.getAllProduct(queryParams);
    sendResponse<IProductWithCatagory[]>(res, {
      statusCode: 200,
      success: true,
      message: "Products retrieved successfully",
      meta,
      data: products,
    });
  });

  static getProductById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String (req.params.id), 10);
    const result = await productService.getProductById(id);

    sendResponse<IProductWithCatagory>(res, {
      statusCode: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: result,
    });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await productService.updateProduct(id, req.body);

    sendResponse<IProduct>(res, {
      statusCode: 200,
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  });
  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    await productService.deleteProduct(id);

    sendResponse<null>(res, {
      statusCode: 200,
      success: true,
      message: 'Product deleted successfully',
      data: null,
    });
  });
}
