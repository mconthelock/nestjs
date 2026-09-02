import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_MELT_REPORT } from './interface/main.interface';

@Injectable()
export class SendVgmMeltRepository extends OracleRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    /**
     * Get list of DPMS PL Melt Report based on the provided vanndate.
     * @param vanndate e.g. 20260804
     * @returns 
     */
    async getList(vanndate: string): Promise<DPMS_PL_MELT_REPORT[]> {
        return this.execCursor('DPMS_PL_MELT_REPORT', { vanndate }, [
            'vanndate',
        ]);
    }
}
