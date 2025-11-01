import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as dirCompare from 'dir-compare';
import * as path from 'path';
import * as fs from 'fs/promises';

import { ApplicationService } from '../application/application.service';

@Injectable()
export class SourceService {
  private devPath: string;
  private prodPath: string;

  constructor(private readonly apps: ApplicationService) {}

  async compareFolders(id: number = 1) {
    const app = await this.apps.getAppsByID(id);
    this.devPath = `${process.env.SOURCE_DEV}/${app.APP_LOCATION}/`;
    this.prodPath = `${process.env.SOURCE_PROD}/${app.APP_LOCATION}/`;
    const options: dirCompare.Options = {
      compareContent: true,
      skipEmptyDirs: true,
      excludeFilter: process.env.SOURCE_IGNORED,
    };

    const res = await dirCompare.compare(this.devPath, this.prodPath, options);

    if (res.same) {
      return { modified: [], newInDev: [], onlyInProd: [] };
    }

    const modified = [];
    const newInDev = [];
    const onlyInProd = [];

    res.diffSet.forEach((diff) => {
      // สร้าง path แบบ relative (เช่น 'application/controllers/Welcome.php')
      const relativePath = path.join(
        diff.relativePath,
        diff.name1 || diff.name2,
      );

      if (diff.state === 'distinct') {
        // ไฟล์ต่างกัน
        modified.push(relativePath);
      } else if (diff.state === 'left') {
        // มีแค่ใน Dev (ไฟล์ใหม่)
        newInDev.push(relativePath);
      } else if (diff.state === 'right') {
        // มีแค่ใน Prod (ถูกลบใน Dev)
        onlyInProd.push(relativePath);
      }
    });

    return { modified, newInDev, onlyInProd };
  }

  async syncFiles(filesToSync: string[]) {
    const results = {
      copied: [],
      errors: [],
    };

    for (const file of filesToSync) {
      const sourcePath = path.join(this.devPath, file);
      const destPath = path.join(this.prodPath, file);

      try {
        // สร้าง directory ปลายทางก่อน ถ้ายังไม่มี
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        // Copy ไฟล์
        await fs.copyFile(sourcePath, destPath);
        results.copied.push(file);
      } catch (err) {
        results.errors.push({ file, error: err.message });
      }
    }

    if (results.errors.length > 0) {
      throw new InternalServerErrorException(results);
    }

    return results;
  }

  async getFileContent(id: number, fileName: string) {
    const app = await this.apps.getAppsByID(id);
    this.devPath = `${process.env.SOURCE_DEV}/${app.APP_LOCATION}/`;
    this.prodPath = `${process.env.SOURCE_PROD}/${app.APP_LOCATION}/`;
    //const [devFilePath, prodFilePath] = this.validateAndResolvePaths(fileName);
    const devFilePath = path.join(this.devPath, fileName);
    const prodFilePath = path.join(this.prodPath, fileName);
    // 2. อ่านไฟล์
    const readDevFile = fs.readFile(devFilePath, 'utf-8');
    const readProdFile = fs.readFile(prodFilePath, 'utf-8');
    const [devResult, prodResult] = await Promise.allSettled([
      readDevFile,
      readProdFile,
    ]);

    // ถ้าไฟล์ใน Prod ไม่มี (เช่น ไฟล์ใหม่) ให้ส่งค่าว่าง
    const devContent =
      devResult.status === 'fulfilled' ? devResult.value : null;
    const prodContent =
      prodResult.status === 'fulfilled' ? prodResult.value : null;

    // if (devContent === null && devResult.reason?.code === 'ENOENT') {
    //   throw new BadRequestException(`File not found in Dev: ${fileName}`);
    // }
    return { devContent, prodContent };
  }

  /**
   * Helper: ตรวจสอบความปลอดภัย Path Traversal Attack
   */
  private validateAndResolvePaths(fileName: string): [string, string] {
    const normalizedDevPath = path.resolve(this.devPath);
    const normalizedProdPath = path.resolve(this.prodPath);

    const resolvedDevFile = path.resolve(normalizedDevPath, fileName);
    const resolvedProdFile = path.resolve(normalizedProdPath, fileName);
    console.log(`resolvedDevFile ${resolvedDevFile}`);
    // ⚠️ Security Check ⚠️
    // ต้องมั่นใจว่า path ที่ขอมา อยู่ "ภายใน" โฟลเดอร์ที่เรากำหนด
    if (
      !resolvedDevFile.startsWith(normalizedDevPath) ||
      !resolvedProdFile.startsWith(normalizedProdPath)
    ) {
      throw new BadRequestException(
        'Invalid file path (Path Traversal attempt)',
      );
    }

    return [resolvedDevFile, resolvedProdFile];
  }
}
