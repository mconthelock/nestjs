import * as fs from 'fs';
import * as path from 'path';
import { diskStorage, Options as MulterOptions } from 'multer';
import { BadRequestException } from '@nestjs/common';

const getFileExtension = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  if (ext) return ext;

  // fallback ถ้า originalname ไม่มีนามสกุล
  switch (file.mimetype) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    default:
      return '';
  }
};

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      console.log(req);

      const uploadPath = path.join(req.body.destination);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = getFileExtension(file);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/*'];
    const isMimeTypeAllowed = allowedMimeTypes.some((mimePattern) => {
      const regex = new RegExp(`^${mimePattern.replace('*', '.*')}$`);
      return regex.test(file.mimetype);
    });
    if (!isMimeTypeAllowed) {
      //return cb(new BadRequestException('File type not supported!'), false);
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB
  },
};
