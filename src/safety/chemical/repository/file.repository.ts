import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHEMICAL_FILES } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_FILES.entity';

@Injectable()
export class FileRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: STY_CHEMICAL_FILES) {
        return this.getRepository(STY_CHEMICAL_FILES).save(data);
    }

    delete(chemicalId: number) {
        return this.getRepository(STY_CHEMICAL_FILES).delete({
            AMEC_SDS_ID: chemicalId,
        });
    }
}
