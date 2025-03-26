import { Router } from 'express';

import contactsRouters from './contacts.js';
import authRouters from './auth.js';

const router = Router();

router.use('/contacts', contactsRouters);
router.use('/auth', authRouters);

export default router;
