import { BadRequestException } from '@nestjs/common';
import { join, normalize } from 'path';
import * as mime from 'mime-types';
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
  newName?: string, // ถ้าไม่ส่ง จะใช้ชื่อที่ Multer ตั้ง (file.filename)
) {
  await fs.mkdir(destinationDir, { recursive: true });

  const targetName = newName ?? file.filename; // เช่น 1734...-xxx.pdf
  const targetPath = join(destinationDir, targetName);
  let status = false;
  try {
    await fs.rename(file.path, targetPath); // ย้ายจาก tmp → ปลายทาง
    status = true; // ถ้าย้ายสำเร็จ
  } catch (err: any) {
    // เผื่อเจอ EXDEV (ข้ามดิสก์) ให้ fallback เป็น copy + unlink
    if (err.code === 'EXDEV') {
      await fs.copyFile(file.path, targetPath);
      await fs.unlink(file.path);
      status = true; // ถ้า copy สำเร็จ
    } else {
      await deleteFile(file.path); // ลบไฟล์ต้นทาง
      throw err;
    }
  }
  return {
    status: status,
    originalName: file.originalname,
    newName: targetName,
    mimetype: file.mimetype,
    size: file.size,
    path: targetPath,
  };
}

export async function deleteFile(path: string) {
  try {
    await fs.rm(path, { force: true, maxRetries: 2, retryDelay: 100 }); // ลบไฟล์ force = ไม่ throw error
  } catch (err: any) {
    console.warn(`ลบไฟล์ ${path} ไม่สำเร็จ:`, err.message);
  }
}

export async function cleanupTmp(files: Express.Multer.File[]) {
  await Promise.allSettled(files.map((f) => deleteFile(f.path)));
}

// ฟังก์ชันนี้รับชื่อไฟล์ (name) แล้วคืนค่า MIME type ที่เหมาะสม
export function getMimeType(name: string) {
  // ใช้ mime.lookup เพื่อตรวจสอบ MIME type จากชื่อไฟล์
  // ถ้าไม่พบ จะคืนค่า 'application/octet-stream' (ค่ามาตรฐานสำหรับไฟล์ทั่วไป)
  return mime.lookup(name) || 'application/octet-stream';
}

/**
 * สร้างค่า Content-Disposition header สำหรับการตอบกลับไฟล์
 *
 * @param oname - ชื่อไฟล์ต้นฉบับที่ต้องการแนบใน header
 * @param mode - โหมดการแสดงไฟล์: 'open' สำหรับ inline หรือ 'download' สำหรับ attachment
 * @returns สตริง Content-Disposition ที่เหมาะสมกับชื่อไฟล์และโหมดที่เลือก
 */
export function buildContentDisposition(
  oname: string,
  mode: 'open' | 'download',
) {
  const encoded = encodeURIComponent(oname).replace(/['()]/g, escape);
  const type = mode === 'download' ? 'attachment' : 'inline';
  return `${type}; filename="${oname}"; filename*=UTF-8''${encoded}`;
}

/**
 * รวม path อย่างปลอดภัยเพื่อป้องกัน path traversal (เช่น ../)
 *
 * @param baseDir โฟลเดอร์หลักที่อนุญาตให้เข้าถึง
 * @param fileName ชื่อไฟล์หรือ path ย่อยที่ต้องการรวมกับ baseDir
 * @returns path ที่รวมแล้วและผ่านการตรวจสอบความปลอดภัย
 * @throws BadRequestException หาก path ที่รวมแล้วไม่ได้อยู่ใน baseDir
 */
export function safeJoin(baseDir: string, fileName: string) {
  // รวม path อย่างปลอดภัย ป้องกัน path traversal (เช่น ../)
  // baseDir: โฟลเดอร์หลักที่อนุญาต
  // fileName: ชื่อไฟล์หรือ path ย่อยที่ต้องการรวม
  const base = normalize(baseDir);
  const full = normalize(join(baseDir, fileName));
  if (!full.startsWith(base)) {
    // ถ้า path ที่รวมแล้วไม่ได้อยู่ใน baseDir ให้ throw error
    throw new BadRequestException('Invalid path');
  }
  return full;
}
