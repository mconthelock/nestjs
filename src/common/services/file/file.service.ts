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
  deleteFile,
  getMimeType,
  moveFileFromMulter,
  safeJoin,
} from 'src/common/utils/files.utils';
import { FileDto, ListDto, SaveFileDto } from './dto/file.dto';

@Injectable()
export class FileService {
  private readonly skip = ['thumbs.db', 'desktop.ini'];
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

  //prettier-ignore
  async listDir(dto: ListDto) {
    const dirPath = safeJoin(dto.baseDir, dto.path ?? ''); // กัน traversal

    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) {
      throw new BadRequestException('Not a directory');
    }

    const names = await fs.readdir(dirPath);
    const items = await Promise.all(
      names.map(async (name) => {
        const full = safeJoin(dirPath, name);
        const s = await fs.stat(full);

        return {
          name,
          isDir: s.isDirectory(),
          size: s.isFile() ? s.size : undefined,
          path: full, // เก็บ relative path เอาไปใช้ตอนเปิดไฟล์
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

    // กรองตามนามสกุลที่อนุญาต
    const allowEts = dto.allow?.filter(e => e.trim() !== '').map(e => e.toLowerCase());
            console.log(allowEts,dto.allow);
    
    const filtered = items.filter(e => {
        if(allowEts && allowEts.length > 0) {
            return (e.isDir || (e.extension && allowEts.includes(e.extension.toLowerCase()))) && !e.name.startsWith('~$') && !e.name.startsWith('.') && !this.skip.includes(e.name.toLowerCase()) ;
        }else{
            return !e.name.startsWith('~$') && !e.name.startsWith('.') && !this.skip.includes(e.name.toLowerCase()) ;
        }
    });

    return filtered;
  }

  //prettier-ignore
  async listAllRecursively(dto: ListDto) {
    const root = safeJoin(dto.baseDir, dto.path ?? '');
    const allowEts = dto.allow?.filter(e => e.trim() !== '').map(e => e.toLowerCase());

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

        // ข้ามไฟล์ซ่อนตามกติกาเราเอง
        if (
          entry.name.startsWith('~$') || // ไฟล์ชั่วคราวของ Excel
          entry.name.startsWith('.') || // พวก .git, .DS_Store ฯลฯ (ถ้าอยากตัด)
          this.skip.includes(entry.name.toLowerCase())
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
            if( allowEts && allowEts.length > 0 ) {
                const ext = path.extname(entry.name).slice(1).toLowerCase();
                if( !allowEts.includes(ext) ) continue;
            }
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

    await walk(root, dto.path);
    return results;
  }

  async saveFile(files: Express.Multer.File[], dto: SaveFileDto) {
    let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      const data = [];
        console.log(files);
        
      console.log(dto.path);
      

      for (const file of files) {
        console.log(file);
        
        const moved = await moveFileFromMulter(file, dto.path);
        movedTargets.push(moved.path);
        movedTargets.push(file.path);
        data.push(moved);
      }
      return { status: true, data };
    } catch (err) {
      for (const filePath of movedTargets) {
        await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
      }
      throw err;
    }
  }
}
