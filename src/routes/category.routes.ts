import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from '../validations/category.validation.js';

const router = Router();

router
  .route('/')
  .post(validate(createCategorySchema), CategoryController.createCategory)
  .get(CategoryController.getAllCategories);

router
  .route('/:id')
  .get(validate(categoryIdParamSchema), CategoryController.getCategoryById)
  .patch(validate(updateCategorySchema), CategoryController.updateCategory)
  .delete(validate(categoryIdParamSchema), CategoryController.deleteCategory);

export const categoryRoutes = router;