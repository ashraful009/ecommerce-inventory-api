import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productQuerySchema,
} from '../validations/product.validation.js';

const router = Router();

router
  .route('/')
  .post(validate(createProductSchema), ProductController.createProduct)
  .get(validate(productQuerySchema), ProductController.getAllProducts);

router
  .route('/:id')
  .get(validate(productIdParamSchema), ProductController.getProductById)
  .patch(validate(updateProductSchema), ProductController.updateProduct)
  .delete(validate(productIdParamSchema), ProductController.deleteProduct);

export const productRoutes = router;
