import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class SendVgmMeltRepository extends OracleRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getList(vanndate: string) {
        return this.execCursor('DPMS_PL_MELT_REPORT', { vanndate }, [
            'vanndate',
        ]);
    }
}
