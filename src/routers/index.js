import { Router } from 'express';

import contactsRouters from './contacts.js';
import authRouters from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/contacts', authenticate, contactsRouters);
router.use('/auth', authRouters);

export default router;
