import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';
import { ISDEV_OBJECTIVE } from 'src/common/Entities/webform/table/ISDEV_OBJECTIVE.entity';
import { IS_DEVICEMST } from 'src/common/Entities/webform/table/IS_DEVICEMST.entity';
import { LABORCOST } from 'src/common/Entities/webform/table/LABORCOST.entity';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';

import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer';
import { SearchIsDevDto } from './dto/search-is-dev.dto';

@Injectable()
export class IsDevService {
    constructor(
        @InjectRepository(ISDEV_DEVELOPER, 'webformConnection')
        private readonly developer: Repository<ISDEV_DEVELOPER>,

        @InjectRepository(ISDEV_OBJECTIVE, 'webformConnection')
        private readonly obj: Repository<ISDEV_OBJECTIVE>,

        @InjectRepository(IS_DEVICEMST, 'webformConnection')
        private readonly device: Repository<IS_DEVICEMST>,

        @InjectRepository(LABORCOST, 'webformConnection')
        private readonly laborcost: Repository<LABORCOST>,

        @InjectRepository(ISDEV_REQUEST, 'webformConnection')
        private readonly req: Repository<ISDEV_REQUEST>,
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

    //   async findByYear(year) {
    //     const results = await this.isdev.find({
    //       where: { CYEAR2: year },
    //       relations: {
    //         form: {
    //           flow: true,
    //           creator: true,
    //         },
    //       },
    //       order: { NRUNNO: 'ASC' },
    //     });

    //     // Filter only flow with CSTEPNO = '00'
    //     return results.map((isdev) => {
    //       if (Array.isArray(isdev.form.flow)) {
    //         const manager = isdev.form.flow.find((f) => f.CSTEPNO === '10');
    //         const pic = isdev.form.flow.find((f) => f.CSTEPNEXTNO === '00');
    //         const running = isdev.form.flow.find((f) => f.CSTEPST === '3');

    //         isdev.form = { ...isdev.form, ...{ manager } };
    //         isdev.form = { ...isdev.form, ...{ pic } };
    //         isdev.form = { ...isdev.form, ...{ running } };
    //         delete isdev.form.flow;
    //       }
    //       return isdev;
    //     });
    //   }

    //   async findById(year, id) {
    //     return await this.isdev.findOne({
    //       where: { CYEAR2: year, NRUNNO: id },
    //       relations: {
    //         form: {
    //           flow: true,
    //           creator: true,
    //         },
    //       },
    //     });
    //   }

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

    //ISDEV_OBJECTIVE
    async findAllObjective() {
        return await this.obj.find();
    }

    //IS_DEVICEMST
    async findAllDeviceMst() {
        return await this.device.find();
    }

    //LABORCOST
    async findAllLaborcost() {
        return await this.laborcost.find();
    }
}
