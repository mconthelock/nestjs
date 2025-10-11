import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function getFileUploadInterceptor(
  field: string | { name: string; maxCount?: number }[],
  multi = false,
  maxCount = 10,
) {
  // กำหนด storage กลาง
  const storage = diskStorage({
    destination: `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`,
    filename: (req, file, cb) => {
      // ✅ แปลงชื่อก่อนใช้งานทุกครั้ง
      file.originalname = fixName(file.originalname);
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  if (Array.isArray(field)) {
    return FileFieldsInterceptor(field, { storage });
  } else if (multi) {
    return FilesInterceptor(field, maxCount, { storage });
  } else {
    return FileInterceptor(field, { storage });
  }
}

function fixName(name: string) {
  try {
    return Buffer.from(name, 'latin1').toString('utf8');
  } catch {
    return name;
  }
}
