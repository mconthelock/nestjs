import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQaFileDto } from './dto/create-qa_file.dto';
import { UpdateQaFileDto } from './dto/update-qa_file.dto';
import { SearchQaFileDto } from './dto/search-qa_file.dto';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { QaFileRepository } from './qa_file.repository';

@Injectable()
export class QaFileService {
    constructor(private readonly repo: QaFileRepository) {}

    async getQaFile(dto: SearchQaFileDto) {
        return this.repo.getQaFile(dto);
    }

    async getQaFileByID(dto: SearchQaFileDto) {
        return this.repo.getQaFileByID(dto);
    }

    async setId(dto: SearchQaFileDto) {
        const lastID = await this.repo.getNextSeq(dto);
        if (lastID.length > 0) {
            return lastID[0].FILE_ID + 1;
        } else {
            return 1;
        }
    }

    async moveAndInsertFiles(d: {
        files: Express.Multer.File[];
        form: FormDto;
        path: string;
        folder?: string;
        typecode: string; //'ESF', 'ESI'
        requestedBy: string;
        ext1?: number;
        ext2?: string;
    }) {
        // const path = d.path.endsWith('/') ? d.path : d.path + '/';
        const destination = d.folder
            ? await joinPaths(d.path, d.folder)
            : d.path; // Get the destination path
        const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        for (const file of d.files) {
            const moved = await moveFileFromMulter({ file, destination });
            movedTargets.push(moved.path);
            await this.createQaFile({
                ...d.form,
                FILE_TYPECODE: d.typecode,
                FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                FILE_USERCREATE: d.requestedBy,
                FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                FILE_EXTRA_KEY1: d.ext1 ?? null,
                FILE_EXTRA_KEY2: d.ext2 ?? null,
            });
        }
        return movedTargets;
    }

    async createQaFile(dto: CreateQaFileDto) {
        try {
            const condition = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                FILE_TYPECODE: dto.FILE_TYPECODE,
            };
            const id = await this.setId(condition);
            const data = {
                ...dto,
                FILE_ID: id,
            };

            const res = await this.repo.insert(data);
            if (res.identifiers.length === 0) {
                throw new Error('No rows inserted');
            }
            return {
                status: true,
                message: 'Inserted Successfully',
                data: { FILE_ID: id },
            };
        } catch (error) {
            throw new Error('Insert QaFile Failed: ' + error.message);
        }
    }

    async delete(dto: UpdateQaFileDto) {
        try {
            const condition = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                FILE_TYPECODE: dto.FILE_TYPECODE,
            };
            if (dto.FILE_ID !== undefined) condition['FILE_ID'] = dto.FILE_ID;

            const res = await this.repo.delete(condition);
            if (res.affected === 0) {
                throw new Error('No rows deleted');
            }
            return { status: true, message: 'Delete master Successfully' };
        } catch (error) {
            throw new Error('Delete master Error: ' + error.message);
        }
    }
}
