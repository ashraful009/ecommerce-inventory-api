import { UserService } from "../services/user.service.js"
import { IUser } from "../types/user.types.js";
import { catchAsync } from "../utils/catchAsync.js"
import { Request, Response } from 'express';
import { sendResponse } from "../utils/sendResponse.js";

const userService = new UserService(); 

export class UserControler {
    static createUser = catchAsync(async(req: Request, res: Response) => {
    const result = await userService.createUser(req.body);

      sendResponse<IUser>(res, {
      statusCode: 201,
      success: true,
      message: 'User created successfully',
      data: result,
    });
 });

 static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers();

    sendResponse<IUser[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      meta: {
        total: result.length,
      },
      data: result,
    });
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await userService.getUserById(id);

    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const result = await userService.updateUser(id, req.body);

    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  });
  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    await userService.deleteUser(id);

    sendResponse<null>(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  });
}