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

import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { FormCreateService } from 'src/webform/form/create-form.service';

import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';
import { IsDevFormRepository } from './is-dev.repositoty';

import { FormDto } from 'src/webform/form/dto/form.dto';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { SearchIsDevDto } from './dto/search-is-dev.dto';
import { CreateIsDevDto } from './dto/create-is-dev.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { CreateManhoursDto } from './dto/create-manhours.dto';
import { CreateInvestDto } from './dto/create-invest.dto';

@Injectable()
export class IsDevService {
    constructor(
        @InjectRepository(ISDEV_DEVELOPER, 'webformConnection')
        private readonly developer: Repository<ISDEV_DEVELOPER>,
        @InjectRepository(ISDEV_REQUEST, 'webformConnection')
        private readonly req: Repository<ISDEV_REQUEST>,
        protected readonly formcreateservice: FormCreateService,
        private readonly repo: IsDevFormRepository,
        private readonly fileService: HandleFileFormService,
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
        ip: string,
        dto: CreateIsDevDto,
        files?: Express.Multer.File[],
    ) {
        try {
            let form: FormDto;
            const { REQBY, INPUTBY, DRAFT, REMARK, ...tmp } = dto;
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
            form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            await this.repo.create({ ...form, ...dto });
            // Insert file
            for (const file of files ?? []) {
                await this.fileService.insertFiles(
                    {
                        ...form,
                        FORM_TYPE: 'IS',
                        FILE_CODE: 'FILE',
                        CREATEBY: INPUTBY,
                    },
                    file,
                );
            }

            if (dto.benefit) {
                for (const bf of dto?.benefit) {
                    const benefitData = { ...form, ...bf };
                    await this.repo.createBenefit(benefitData);
                }
            }

            if (dto.manhours) {
                for (const mh of dto?.manhours) {
                    const manhoursData = { ...form, ...mh };
                    await this.repo.createManhours(manhoursData);
                }
            }

            if (dto.invest) {
                for (const inv of dto?.invest) {
                    const investData = { ...form, ...inv };
                    await this.repo.createInvest(investData);
                }
            }
        } catch (error) {
            console.log(error);
            throw new Error('Request IS-DEV Form Error: ' + error.message);
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
