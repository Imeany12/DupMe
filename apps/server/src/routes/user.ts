import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import {
  changePassword,
  createUser,
  editUserProfile,
  getUserProfile,
  getUsers,
  loginUser,
  removeUser,
  saveKeybindings,
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
router.post('/:username/deleteAccount', removeUser);
router.post('/:username/upload', upload.single('image'), uploadImage);
router.get('/:username/profile', getUserProfile);
router.post('/:username/profile/edit', editUserProfile);
router.post('/:username/profile/changePassword', changePassword);
router.post('/:username/profile/keybinds', saveKeybindings);

export default router;
