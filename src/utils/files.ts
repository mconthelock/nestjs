import { join } from 'path';
import { promises as fs } from 'fs';
// import { existsSync, mkdirSync, renameSync } from 'fs';
// /**
//  * Moves a file from source to destination.
//  * @param sourcePath - The path of the file to be moved.
//  * @param destinationPath - The directory where the file should be moved.
//  * @param fileName - The name of the file after moving.
//  * @example
//  * moveFile('/path/to/source/file.txt', '/path/to/destination', 'newFileName.txt');
//  */
// export function moveFile(sourcePath: string = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`, destinationPath: string, fileName: string): void {
//   // 1. Check if destination directory exists, if not create it
//   if (!existsSync(destinationPath)) {
//     mkdirSync(destinationPath, { recursive: true });
//   }

//   // 2. Move/rename the file
//   const newFilePath = join(destinationPath, fileName);
//   renameSync(sourcePath, newFilePath);
// }


export async function moveFileFromMulter(
  file: Express.Multer.File,
  destinationDir: string,
  newName?: string,        // ถ้าไม่ส่ง จะใช้ชื่อที่ Multer ตั้ง (file.filename)
) {
  await fs.mkdir(destinationDir, { recursive: true });

  const targetName = newName ?? file.filename;     // เช่น 1734...-xxx.pdf
  const targetPath = join(destinationDir, targetName);

  try {
    await fs.rename(file.path, targetPath);        // ย้ายจาก tmp → ปลายทาง
  } catch (err: any) {
    // เผื่อเจอ EXDEV (ข้ามดิสก์) ให้ fallback เป็น copy + unlink
    if (err.code === 'EXDEV') {
      await fs.copyFile(file.path, targetPath);
      await fs.unlink(file.path);
    } else {
      throw err;
    }
  }

  return {
    originalName: file.originalname,
    newName: targetName,
    mimetype: file.mimetype,
    size: file.size,
    path: targetPath,
  };
}

export async function deleteFile(path: string) {
  try {
    await fs.rm(path, { force: true, maxRetries: 2, retryDelay: 100 });
  } catch (err: any) {
    console.warn(`ลบไฟล์ ${path} ไม่สำเร็จ:`, err.message);
   }
}

export async function cleanupTmp(files: Express.Multer.File[]) {
  await Promise.allSettled(files.map(f => deleteFile(f.path)));
}