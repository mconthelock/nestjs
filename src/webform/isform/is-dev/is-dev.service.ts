import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import {
    copyFile,
    deleteFile,
    joinPaths,
    moveFileFromMulter,
} from 'src/common/utils/files.utils';

import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';

import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer';
import { SearchIsDevDto } from './dto/search-is-dev.dto';
import { CreateIsDevDto } from './dto/create-is-dev.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { IsDevFormRepository } from './is-dev.repositoty';

@Injectable()
export class IsDevService {
    constructor(
        @InjectRepository(ISDEV_DEVELOPER, 'webformConnection')
        private readonly developer: Repository<ISDEV_DEVELOPER>,

        // @InjectRepository(ISDEV_OBJECTIVE, 'webformConnection')
        // private readonly obj: Repository<ISDEV_OBJECTIVE>,

        // @InjectRepository(IS_DEVICEMST, 'webformConnection')
        // private readonly device: Repository<IS_DEVICEMST>,

        // @InjectRepository(LABORCOST, 'webformConnection')
        // private readonly laborcost: Repository<LABORCOST>,

        @InjectRepository(ISDEV_REQUEST, 'webformConnection')
        private readonly req: Repository<ISDEV_REQUEST>,

        protected readonly formcreateservice: FormCreateService,
        private readonly repo: IsDevFormRepository,
    ) {}

    async search(q: SearchIsDevDto) {
        const qb = this.req
            .createQueryBuilder('req')
            .leftJoinAndSelect('req.category', 'category')
            .leftJoinAndSelect('req.type', 'type')
            .leftJoinAndSelect('req.objective', 'objective')
            .leftJoinAndSelect('req.status', 'status')
            .leftJoinAndSelect('req.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.flow', 'flow');
        await applyDynamicFilters(qb, q, 'req');
        return await qb.getMany();
    }

    async create(
        dto: CreateIsDevDto,
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        },
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        const allFilesWithType = [
            ...(files['fileCer[]'] || []).map((file) => ({ file, type: 11 })),
            ...(files['fileOther[]'] || []).map((file) => ({ file, type: 2 })),
        ];

        try {
            const { REQBY, INPUTBY, DRAFT, REMARK, ...data } = dto;
            const createForm = await this.formcreateservice.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                    ...(DRAFT !== undefined && { DRAFT: DRAFT }),
                },
                ip,
            );
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
        } catch (error) {
            const tmpFilePaths = allFilesWithType.map((item) => item.file.path);
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)),
                ...tmpFilePaths.map((f) => deleteFile(f)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error('Request PRO-VMM Form Error: ' + error.message);
        }
    }

    //ISDEV_DEVELOPER
    async createDev(dto: CreateDeveloperDto) {
        const newDev = this.developer.create(dto as unknown as ISDEV_DEVELOPER);
        await this.developer.save(newDev);
        return await this.developer.findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                DEV_SEQ: dto.DEV_SEQ,
            },
            relations: ['info'],
        });
    }

    async deleteDev(dto: UpdateDeveloperDto) {
        const devToDelete = await this.developer.findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                DEV_SEQ: dto.DEV_SEQ,
            },
        });

        if (devToDelete) {
            await this.developer.remove(devToDelete);
            return { message: 'Developer deleted successfully' };
        } else {
            return { message: 'Developer not found' };
        }
    }

    //ISDEV_CATEGORY
    async findAllCategory() {
        return await this.repo.listCategory();
    }

    //ISDEV_OBJECTIVE
    async findAllObjective() {
        return await this.repo.listObjective();
    }

    //IS_DEVICEMST
    async findAllDeviceMst() {
        return await this.repo.listDevice();
    }

    //LABORCOST
    async findAllLaborcost() {
        return await this.repo.listLaborCost();
    }
}
