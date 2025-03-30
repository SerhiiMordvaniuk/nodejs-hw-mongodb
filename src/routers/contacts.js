import { Router } from 'express';

import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

router.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

export default router;
