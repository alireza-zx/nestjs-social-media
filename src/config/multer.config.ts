import path from 'path';
import multer from 'multer';
import { AppError } from 'src/utils/appError';
import slugify from 'slugify';

export const multerOptionsPosts = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads', 'posts'),
    filename(req, file, callback) {
      let name: string = '';
      // @ts-ignore
      const user: User = req.user;
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
        name = `${Date.now()}.${user.id}.${slugify(file.originalname.split('.')[0])}.post.jpg`;
      else if (file.mimetype === 'image/png')
        name = `${Date.now()}.${user.id}.${slugify(file.originalname.split('.')[0])}.post.png`;
      callback(null, name);
    },
  }),
  fileFilter(req, file, callback) {
    const type = file.mimetype;
    if (
      type === 'image/png' ||
      type === 'image/jpg' ||
      type === 'image/jpeg'
    ) return callback(null, true);
    callback(new AppError('invalid file format', 400), false);
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
};

export const multerOptionsAvatars = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads', 'avatars'),
    filename(req, file, callback) {
      let name: string = '';
      // @ts-ignore
      const user: User = req.user;
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
        name = `${Date.now()}.${user.id}.${slugify(file.originalname.split('.')[0])}.avatar.jpg`;
      else if (file.mimetype === 'image/png')
        name = `${Date.now()}.${user.id}.${slugify(file.originalname.split('.')[0])}.avatar.png`;
      callback(null, name);
    },
  }),
  fileFilter(req, file, callback) {
    const type = file.mimetype;
    if (
      type === 'image/png' ||
      type === 'image/jpg' ||
      type === 'image/jpeg'
    ) return callback(null, true);
    callback(new AppError('invalid file format', 400), false);
  },
  limits: {
    fileSize: 3 * 1024 * 1024
  }
};

export const multerOptionsReels = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads', 'reels'),
    filename(req, file, callback) {
      let name: string = '';
      // @ts-ignore
      const user: User = req.user;
      if (file.mimetype === 'video/mp4')
        name = `${Date.now()}.${user.id}.${slugify(file.originalname.split('.')[0])}.reel.mp4`;
      callback(null, name);
    },
  }),
  fileFilter(req, file, callback) {
    const type = file.mimetype;
    if (type === 'video/mp4') return callback(null, true);
    callback(new AppError('invalid file format', 400), false);
  },
  limits: {
    fileSize: 100 * 1024 * 1024
  }
};