import { CategoryRepository } from '../repositories/category.repository.js';
import {
  ICategory,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from '../types/category.types.js';
import { AppError } from '../utils/appError.js';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  // Create Category with duplicate name check
  async createCategory(payload: ICreateCategoryPayload): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findByName(payload.name);
    if (existingCategory) {
      throw new AppError(`Category with name '${payload.name}' already exists`, 409);
    }

    return await this.categoryRepository.create(payload);
  }

  // Get all categories
  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  // Get single category by ID
  async getCategoryById(id: number): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError(`Category with ID ${id} not found`, 404);
    }
    return category;
  }

  // Update Category with duplicate name & existence check
  async updateCategory(
    id: number,
    payload: IUpdateCategoryPayload
  ): Promise<ICategory> {
    // 1. Check if category exists
    await this.getCategoryById(id);

    // 2. If name is being updated, verify it's not already taken by another category
    if (payload.name) {
      const existingCategory = await this.categoryRepository.findByName(payload.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new AppError(`Category with name '${payload.name}' already exists`, 409);
      }
    }

    const updatedCategory = await this.categoryRepository.update(id, payload);
    if (!updatedCategory) {
      throw new AppError('No changes applied to the category', 400);
    }

    return updatedCategory;
  }

  // Delete Category
  async deleteCategory(id: number): Promise<void> {
    // Verify existence first
    await this.getCategoryById(id);

    const isDeleted = await this.categoryRepository.delete(id);
    if (!isDeleted) {
      throw new AppError(`Failed to delete category with ID ${id}`, 500);
    }
  }
}