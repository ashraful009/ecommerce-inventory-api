import { Router } from 'express';
import { UserControler } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../validations/user.validation.js';

const router = Router();

router
  .route('/')
  .post(validate(createUserSchema), UserControler.createUser)
  .get(UserControler.getAllUsers);

router
  .route('/:id')
  .get(validate(userIdParamSchema), UserControler.getUserById)
  .patch(validate(updateUserSchema), UserControler.updateUser)
  .delete(validate(userIdParamSchema), UserControler.deleteUser);

export const userRoutes = router;