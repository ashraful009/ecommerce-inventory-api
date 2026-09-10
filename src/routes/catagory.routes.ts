import { Router } from 'express';
import { CatagoryController } from '../controllers/catagory.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createCatagorySchema,
  updateCatagorySchema,
  catagoryIdParamSchema,
} from '../validations/catagory.validation.js';

const router = Router();

router
  .route('/')
  .post(validate(createCatagorySchema), CatagoryController.createCatagory)
  .get(CatagoryController.getAllCategories);

router
  .route('/:id')
  .get(validate(catagoryIdParamSchema), CatagoryController.getCatagoryById)
  .patch(validate(updateCatagorySchema), CatagoryController.updateCatagory)
  .delete(validate(catagoryIdParamSchema), CatagoryController.deleteCatagory);

export const catagoryRoutes = router;