import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class GrpmstRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.manager.query(`
            SELECT REPLACE(GRPNAME, '@MitsubishiElevatorAsia.co.th', '') AS VDISPLAY_NAME, GRPNAME AS VEMAIL_ADDRESS 
            FROM GRPMST
            UNION
            SELECT SNAME || ' (' ||SEMPNO|| ')', SRECMAIL FROM AMECUSERALL
            WHERE CSTATUS = '1'
            AND SRECMAIL IS NOT NULL`);
    }
}
