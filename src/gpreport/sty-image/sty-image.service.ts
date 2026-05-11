import { Injectable } from '@nestjs/common';
import { CreateStyImageDto } from './dto/create-sty-image.dto';
import { UpdateStyImageDto } from './dto/update-sty-image.dto';
import { deleteFile, joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { StyImageRepository } from './sty-image.repository';

@Injectable()
export class StyImageService {
    constructor(private readonly repo: StyImageRepository) {}

    async moveAndInsertFiles(d: {
        file: Express.Multer.File;
        path: string;
        folder?: string;
        userCreate: string;
        typeId: number;
    }) {
        try {
            const destination = d.folder
                ? await joinPaths(d.path, d.folder)
                : d.path; // Get the destination path
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const moved = await moveFileFromMulter({
                file: d.file,
                destination,
            });
            movedTargets.push(moved.path);
            const insert = await this.createImage({
                IMAGE_ONAME: d.file.originalname, // ชื่อเดิมฝั่ง client
                IMAGE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                TYPE_ID: d.typeId,
                IMAGE_USERCREATE: d.userCreate,
                IMAGE_PATH: destination, // โฟลเดอร์ปลายทาง
            });
            return { path: movedTargets, data: insert.data };
        } catch (error) {
            throw new Error('Failed to move and insert file: ' + error.message);
        }
    }

    async createImage(dto: CreateStyImageDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('No rows inserted');
            }
            return {
                status: true,
                message: 'Inserted Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert IMAGE Failed: ' + error.message);
        }
    }

    async delete(id: number) {
        try {
            // const img = await this.repo.findOne(id);
            // if (!img) {
            //     throw new Error('Image not found with id: ' + id);
            // }

            // await deleteFile(await joinPaths(img.IMAGE_PATH, img.IMAGE_FNAME)); // ลบไฟล์จริง

            const res = await this.repo.delete(id);
            if (res.affected === 0) {
                throw new Error('No rows deleted');
            }
            return {
                status: true,
                message: 'Delete safety image Successfully',
            };
        } catch (error) {
            throw new Error('Delete safety image Error: ' + error.message);
        }
    }
}
