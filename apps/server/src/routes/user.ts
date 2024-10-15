import { Router } from 'express';

import {
  createUser,
  getUsers,
  loginUser,
  removeUser,
} from '../controllers/user';

const router: Router = Router();

router.get('/list', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/deleteAccount', removeUser);

export default router;
