import express from 'express';

import { createUser, getUsers } from '../controllers/user';

const router: express.Router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);

export default router;
