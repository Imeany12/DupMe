import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import {
  createUser,
  editUserProfile,
  getUser,
  getUserProfile,
  getUsers,
  loginUser,
  removeUser,
  uploadImage,
} from '../controllers/user';

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  },
});
const upload = multer({ storage });

router.get('/list', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/:name/deleteAccount', removeUser);
router.post('/:name/upload', upload.single('image'), uploadImage);
router.get('/:name', getUser);
router.get('/:name/profile', getUserProfile);
router.post('/:name/profile/edit', editUserProfile);

export default router;
