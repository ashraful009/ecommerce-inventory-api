import { CatagoryRepository } from '../repositories/catagory.repository.js';
import {
  ICatagory,
  ICreateCatagoryPayload,
  IUpdateCatagoryPayload,
} from '../types/catagory.types.js';
import { AppError } from '../utils/appError.js';

export class CatagoryService {
  private catagoryRepository: CatagoryRepository;

  constructor() {
    this.catagoryRepository = new CatagoryRepository();
  }

  // Create Catagory with duplicate name check
  async createCatagory(payload: ICreateCatagoryPayload): Promise<ICatagory> {
    const existingCatagory = await this.catagoryRepository.findByName(payload.name);
    if (existingCatagory) {
      throw new AppError(`Catagory with name '${payload.name}' already exists`, 409);
    }

    return await this.catagoryRepository.create(payload);
  }

  // Get all categories
  async getAllCategories(): Promise<ICatagory[]> {
    return await this.catagoryRepository.findAll();
  }

  // Get single catagory by ID
  async getCatagoryById(id: number): Promise<ICatagory> {
    const catagory = await this.catagoryRepository.findById(id);
    if (!catagory) {
      throw new AppError(`Catagory with ID ${id} not found`, 404);
    }
    return catagory;
  }

  // Update Catagory with duplicate name & existence check
  async updateCatagory(
    id: number,
    payload: IUpdateCatagoryPayload
  ): Promise<ICatagory> {
    // 1. Check if catagory exists
    await this.getCatagoryById(id);

    // 2. If name is being updated, verify it's not already taken by another catagory
    if (payload.name) {
      const existingCatagory = await this.catagoryRepository.findByName(payload.name);
      if (existingCatagory && existingCatagory.id !== id) {
        throw new AppError(`Catagory with name '${payload.name}' already exists`, 409);
      }
    }

    const updatedCatagory = await this.catagoryRepository.update(id, payload);
    if (!updatedCatagory) {
      throw new AppError('No changes applied to the catagory', 400);
    }

    return updatedCatagory;
  }

  // Delete Catagory
  async deleteCatagory(id: number): Promise<void> {
    // Verify existence first
    await this.getCatagoryById(id);

    const isDeleted = await this.catagoryRepository.delete(id);
    if (!isDeleted) {
      throw new AppError(`Failed to delete catagory with ID ${id}`, 500);
    }
  }
}