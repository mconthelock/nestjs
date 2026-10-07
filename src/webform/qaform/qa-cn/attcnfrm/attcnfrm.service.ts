import { Injectable } from '@nestjs/common';
import { CreateAttcnfrmDto } from './dto/create-attcnfrm.dto';
import { UpdateAttcnfrmDto } from './dto/update-attcnfrm.dto';
import { AttCnFrmRepository } from './attcnfrm.repository';
import { SearchAttCNFileDto } from './dto/search-attcnfrm.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';

@Injectable()
export class AttcnfrmService {
    constructor(private readonly repo: AttCnFrmRepository) {}
    async setId(dto: SearchAttCNFileDto) {
        const lastID = await this.repo.getNextSeq(dto);
        if (lastID.length > 0) {
            return lastID[0].ITEMNO + 1;
        } else {
            return 1;
        }
    }
    async createAttcnfrm(dto: CreateAttcnfrmDto) {
        try {
            const condition = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                TYPENO: dto.TYPENO,
            };
            const id = await this.setId(condition);
            const data = {
                ...dto,
                ITEMNO: id,
            };

            const res = await this.repo.insert(data);
            if (res.identifiers.length === 0) {
                throw new Error('No rows inserted');
            }
            return {
                status: true,
                message: 'Inserted Successfully',
                data: { ITEMNO: id },
            };
        } catch (error) {
            throw new Error('Insert ATTCNFRM Failed: ' + error.message);
        }
    }

    async moveAndInsertFiles(d: {
        files: Express.Multer.File[];
        form: FormDto;
        path: string;
        folder?: string;
        typeno: number;
        requestedBy: string;
    }) {
        // const path = d.path.endsWith('/') ? d.path : d.path + '/';
        const destination = d.folder
            ? await joinPaths(d.path, d.folder)
            : d.path; // Get the destination path
        const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        for (const file of d.files) {
            const moved = await moveFileFromMulter({
                file,
                destination,
                isPhp: true,
            });
            movedTargets.push(moved.path);
            await this.createAttcnfrm({
                ...d.form,
                TYPENO: d.typeno,
                SFILE: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                SEMPNO: d.requestedBy,
            });
        }
        return movedTargets;
    }

    findAll() {
        return `This action returns all attcnfrm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} attcnfrm`;
    }

    update(id: number, updateAttcnfrmDto: UpdateAttcnfrmDto) {
        return `This action updates a #${id} attcnfrm`;
    }

    remove(id: number) {
        return `This action removes a #${id} attcnfrm`;
    }
}
