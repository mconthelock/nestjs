import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Response } from 'express'; 
import { createReadStream, promises as fs } from 'fs'; // ฟังก์ชันอ่านไฟล์และ promise API ของ fs
import { getMimeType, buildContentDisposition, safeJoin } from '../utils/files.utils'; 

export interface Args { // กำหนด interface สำหรับ argument ที่ใช้ส่งไฟล์
  baseDir: string;          // FILE_PATH
  storedName: string;       // FILE_FNAME (ชื่อที่เก็บจริง)
  originalName?: string;    // FILE_ONAME (ถ้ามีจะใช้ตั้งชื่อเวลา download/open)
  mode: 'open'|'download';  // โหมดเปิดไฟล์หรือดาวน์โหลด
}

@Injectable()
export class FileService {
  async downloadOrOpenFile(args: Args): Promise<StreamableFile> { 
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
}