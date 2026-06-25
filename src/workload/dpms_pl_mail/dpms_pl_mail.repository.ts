import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_MAIL } from 'src/common/Entities/workload/table/DPMS_PL_MAIL.entity';

@Injectable()
export class DpmsPlMailRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(displayName: string, emailAddress: string) {
        return this.getRepository(DPMS_PL_MAIL).save({
            VDISPLAY_NAME: displayName,
            VEMAIL_ADDRESS: emailAddress,
        });
    }

    delete(id: number) {
        return this.getRepository(DPMS_PL_MAIL).delete(id);
    }

    findAll() {
        return this.getRepository(DPMS_PL_MAIL).find();
    }
}
