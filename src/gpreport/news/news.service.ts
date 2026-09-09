import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { News } from 'src/common/Entities/gpreport/table/NEWS.entity';
import { NewsFiles } from 'src/common/Entities/gpreport/table/NEWS_FILES.entity';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News, 'gpreportConnection')
        private readonly repo: Repository<News>,
        @InjectRepository(NewsFiles, 'gpreportConnection')
        private readonly files: Repository<NewsFiles>,
    ) {}

    getAvailable() {
        const today = new Date();
        return this.repo.find({
            where: {
                NEWS_END: MoreThanOrEqual(today),
                NEWS_START: LessThanOrEqual(today),
            },
        });
    }

    async findOne(id: number) {
        return await this.repo.findOne({
            where: { NEWS_ID: id },
            relations: ['attachments'],
        });
    }

    async findAll() {
        return await this.repo.find({ relations: ['attachments'] });
    }

    async fileNewsImage(id: string) {
        const filePath = `${process.env.GP_FILE_PATH}/news/images/${id}`;
        if (!fs.existsSync(filePath)) return null;

        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).replace('.', '') || 'webp';
        const base64 = `data:image/${ext};base64,${fileBuffer.toString('base64')}`;

        return base64;
    }

    create(createNewsDto: Partial<News>) {
        return this.repo.save(createNewsDto);
    }

    update(updateNewsDto: Partial<News>) {
        if (!updateNewsDto.NEWS_ID) {
            throw new BadRequestException('NEWS_ID is required');
        }
        return this.repo.update(updateNewsDto.NEWS_ID, updateNewsDto);
    }

    remove(id: string) {
        return this.repo.delete(id);
    }

    createAttachments(data: any) {
        return this.files.save(data);
    }

    removeAttachment(id: number) {
        return this.files.delete({ FILE_ID: id });
    }

    async saveWebp(file: Express.Multer.File) {
        if (!file) return null;

        // สร้างโฟลเดอร์ปลายทาง
        const uploadDir = path.join(`${process.env.GP_FILE_PATH}/news/images`);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // ตั้งชื่อไฟล์ใหม่
        const webpFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filePath = path.join(uploadDir, webpFilename);
        // ใช้ sharp อ่านไฟล์จาก path ที่ Multer เซฟไว้ แล้วแปลงเป็น webp
        await sharp(file.path).webp({ quality: 80 }).toFile(filePath);

        // ลบไฟล์ต้นฉบับ (jpg, png) ที่ Multer เซฟไว้ตอนแรกทิ้ง จะได้ไม่เปลืองพื้นที่
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return webpFilename;
    }
}
