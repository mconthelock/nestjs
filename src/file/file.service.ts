import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, promises as fs } from 'fs'; // ฟังก์ชันอ่านไฟล์และ promise API ของ fs
import * as path from 'path';
import {
  buildContentDisposition,
  getMimeType,
  safeJoin,
} from 'src/common/utils/files.utils';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FileService {
  async downloadOrOpenFile(args: FileDto): Promise<StreamableFile> {
    const fullPath = safeJoin(args.baseDir, args.storedName); // รวม path ให้ปลอดภัย

    try {
      await fs.access(fullPath); // เช็คว่าไฟล์มีอยู่จริงหรือไม่
    } catch {
      throw new NotFoundException('File not found on disk'); // ถ้าไม่มีไฟล์ ให้ throw 404
    }

    const oname = args.originalName || args.storedName; // ตั้งชื่อไฟล์ที่จะแสดงตอนโหลด (ถ้าไม่ส่ง originalName จะใช้ชื่อที่เก็บจริง)
    // res.setHeader('Content-Type', getMimeType(oname)); // set header ประเภทไฟล์
    // res.setHeader('Content-Disposition', buildContentDisposition(oname, args.mode)); // set header สำหรับ download/open

    const stream = createReadStream(fullPath); // สร้าง stream สำหรับอ่านไฟล์
    // return new StreamableFile(stream); // ส่ง stream กลับไปให้ NestJS จัดการ response
    return new StreamableFile(stream, {
      type: getMimeType(oname),
      disposition: buildContentDisposition(oname, args.mode),
    });
  }

  async listDir(baseDir: string, relativePath = '') {
    const dirPath = safeJoin(baseDir, relativePath); // กัน traversal

    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) {
      throw new BadRequestException('Not a directory');
    }

    const names = await fs.readdir(dirPath);
    const items = await Promise.all(
      names.map(async (name) => {
        const full = path.join(dirPath, name);
        const s = await fs.stat(full);

        return {
          name,
          isDir: s.isDirectory(),
          size: s.isFile() ? s.size : undefined,
          path: path.posix.join(relativePath, name), // เก็บ relative path เอาไปใช้ตอนเปิดไฟล์
          mimeType: s.isFile() ? getMimeType(name) : undefined,
          extension: s.isFile() ? path.extname(name).slice(1) : undefined, // เอา . ออก
        };
      }),
    );

    // จะ sort folder ขึ้นก่อนก็ได้
    items.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });
    
    const filtered = items.filter(e => 
    !e.name.startsWith('~$') && !e.name.startsWith('.')
    );

    return filtered;
  }

  async listAllRecursively(baseDir: string, relativePath = '') {
    const root = safeJoin(baseDir, relativePath);

    const stat = await fs.stat(root);
    if (!stat.isDirectory()) {
      throw new BadRequestException('Not a directory');
    }

    const results: any[] = [];

    // recursive internal function
    const walk = async (dir: string, rel: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.posix.join(rel, entry.name);
        console.log(results);
        // ข้ามไฟล์ซ่อนตามกติกาเราเอง
        if (
          entry.name.startsWith('~$') || // ไฟล์ชั่วคราวของ Excel
          entry.name.startsWith('.') // พวก .git, .DS_Store ฯลฯ (ถ้าอยากตัด)
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          // push folder
          results.push({
            name: entry.name,
            path: relPath,
            isDir: true,
          });

          // dive deeper
          await walk(fullPath, relPath);
        } else {
          // push file
          results.push({
            name: entry.name,
            path: relPath,
            isDir: false,
            mimeType: getMimeType(entry.name),
            size: (await fs.stat(fullPath)).size,
            extension: path.extname(entry.name).slice(1), // เอา . ออก
          });
        }
      }
    };

    await walk(root, relativePath);
    return results;
  }
}
