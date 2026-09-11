import {
  ICreateUserPayload,
  IUpdateUserPayload,
  IUser,
} from "../types/user.types.js";
import { AppError } from "../utils/appError.js";
import { UserRepository } from "./../repositories/user.repository.js";
export class UserService {
  static createUser(body: any) {
    throw new Error("Method not implemented.");
  }
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(payload: ICreateUserPayload): Promise<IUser> {
    const existingeruser = await this.userRepository.findByEmail(payload.email);
    if (existingeruser) {
      throw new AppError("email already exist", 409);
    }
    return await this.userRepository.create(payload);
  }
async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }
  async getUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    return user;
  }
  async updateUser(id: number, payload: IUpdateUserPayload): Promise<IUser> {
    await this.getUserById(id);

    if (payload.email) {
      const existingUser = await this.userRepository.findByEmail(payload.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError(`Email '${payload.email}' is already in use`, 409);
      }
    }

    const updatedUser = await this.userRepository.updateDynamic(id, payload);
    if (!updatedUser) {
      throw new AppError("No changes applied to the user", 400);
    }

    return updatedUser;
  }
  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id);

    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) {
      throw new AppError(`Failed to delete user with ID ${id}`, 500);
    }
  }
}
