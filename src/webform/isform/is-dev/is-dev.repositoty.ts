import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { CreateIsDevDto } from './dto/create-is-dev.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { CreateManhoursDto } from './dto/create-manhours.dto';
import { CreateInvestDto } from './dto/create-invest.dto';

//Master Section
import { LABORCOST } from 'src/common/Entities/webform/table/LABORCOST.entity';
import { ISDEV_OBJECTIVE } from 'src/common/Entities/webform/table/ISDEV_OBJECTIVE.entity';
import { IS_DEVICEMST } from 'src/common/Entities/webform/table/IS_DEVICEMST.entity';
import { ISDEV_CATEGORY } from 'src/common/Entities/webform/table/ISDEV_CATEGORY.entity';

//Requester Section
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';
import { ISDEV_BENEFIT } from 'src/common/Entities/webform/table/ISDEV_BENEFIT.entity';
import { ISDEV_MANHOURS } from 'src/common/Entities/webform/table/ISDEV_MANHOURS.entity';
import { ISDEV_INVESTMENT } from 'src/common/Entities/webform/table/ISDEV_INVESTMENT.entity';

@Injectable()
export class IsDevFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async create(dto: CreateIsDevDto) {
        return this.getRepository(ISDEV_REQUEST).save(dto);
    }

    async createBenefit(dto: CreateBenefitDto) {
        return this.getRepository(ISDEV_BENEFIT).save(dto);
    }

    async createManhours(dto: CreateManhoursDto) {
        return this.getRepository(ISDEV_MANHOURS).save(dto);
    }

    async createInvest(dto: CreateInvestDto) {
        return this.getRepository(ISDEV_INVESTMENT).save(dto);
    }

    //List Master Data
    async listLaborCost() {
        return this.getRepository(LABORCOST).find();
    }

    async listObjective() {
        return this.getRepository(ISDEV_OBJECTIVE).find();
    }

    async listDevice() {
        return this.getRepository(IS_DEVICEMST).find();
    }

    async listCategory() {
        return this.getRepository(ISDEV_CATEGORY).find();
    }
}
