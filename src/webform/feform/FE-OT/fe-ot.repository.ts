import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConectionService } from 'src/as400/conection/conection.service';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreatefeotDetails } from './dto/create-fe-ot.dto';
import { FEOT_DETAILS } from 'src/common/Entities/webform/table/FEOT_DETAILS.entity';

@Injectable()
export class FEOTRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async createDetails(dto: CreatefeotDetails) {
        return this.getRepository(FEOT_DETAILS).save(dto);
    }

    async getDataOT() {
        return this.getRepository(FEOT_DETAILS).find();
    }
}
