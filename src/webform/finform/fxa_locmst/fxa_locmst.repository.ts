import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FXA_LOCMST } from 'src/common/Entities/webform/table/FXA_LOCMST.entity';

@Injectable()
export class FXALOCMSTRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from ORGANIZATIONS`);
        // return this.getRepository(ORGANIZATIONS).find();
        return this.manager.find(FXA_LOCMST ,  {
        relations: ['ORG', 'POS'] 
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(FXA_LOCMST, 'L');
        qb.leftJoinAndSelect('L.ORG', 'org')
          .leftJoinAndSelect('L.POS', 'pos');
        this.applyFilters(qb, 'L', dto, [
            'LOCCODE',
            'LOCNAME',
            'org.VNAME'
        ]);
        return qb.getMany();
    }
}
