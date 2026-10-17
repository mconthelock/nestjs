import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { CreateIsDevDto } from './dto/create-is-dev.dto';

//Master Section
import { LABORCOST } from 'src/common/Entities/webform/table/LABORCOST.entity';
import { ISDEV_OBJECTIVE } from 'src/common/Entities/webform/table/ISDEV_OBJECTIVE.entity';
import { IS_DEVICEMST } from 'src/common/Entities/webform/table/IS_DEVICEMST.entity';
import { ISDEV_CATEGORY } from 'src/common/Entities/webform/table/ISDEV_CATEGORY.entity';

//Requester Section
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';

@Injectable()
export class IsDevFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async create(dto: CreateIsDevDto) {
        return this.getRepository(ISDEV_REQUEST).save(dto);
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
