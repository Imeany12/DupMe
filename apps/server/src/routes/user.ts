import { Router } from 'express';

import { createUser, getUsers, loginUser } from '../controllers/user';

const router: Router = Router();

router.get('/list', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);

export default router;
