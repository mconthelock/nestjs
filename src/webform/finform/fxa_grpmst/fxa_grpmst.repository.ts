import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FXA_GRPMST } from 'src/common/Entities/webform/table/FXA_GRMST.entity';

@Injectable()
export class FXAGRPRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
    findAll() {
        return this.manager.find(FXA_GRPMST);
    }


}
