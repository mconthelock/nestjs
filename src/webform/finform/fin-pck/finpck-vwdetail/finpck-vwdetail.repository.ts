import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FINPCK_VWDETAIL } from 'src/common/Entities/webform/views/FINPCK_VWDETAIL.entity';

@Injectable()
export class VWDetailRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async searchData(filters: any) {
        console.log(filters);
        
        const { reportType, ...dbFilters } = filters;
        const whereCondition = Object.fromEntries(
            Object.entries(dbFilters).filter(([_, value]) => value != null && value !== '')
        );
        return await this.getRepository(FINPCK_VWDETAIL).find({
            where: whereCondition,
        });
    }

}
