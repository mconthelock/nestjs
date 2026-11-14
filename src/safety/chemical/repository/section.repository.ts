import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHM_SEC } from 'src/common/Entities/gpreport/views/STY_CHM_SEC.entity';
import { STY_CHEMICAL_SECTION } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_SECTION.entity';
import { SectionSubscriber } from '../subscriber/section.subscriber';

@Injectable()
export class SectionRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
        ds.subscribers.push(new SectionSubscriber());
    }

    getMasterSection(ownerCode: string) {
        return this.getRepository(STY_CHM_SEC).find({
            select: [
                'AMEC_SDS_ID',
                'CHEMICAL_NAME',
                'REV',
                'EFFECTIVE_DATE',
                'RECEIVED_SDS_DATE',
                'USED_FOR',
                'USED_AREA',
                'KEEPING_POINT',
                'QTY',
                'REC4052',
                'REC4054',
                'CLASS',
                'CLASSNAME',
            ],
            where: {
                OWNERCODE: ownerCode,
                STATUS: 1,
            },
            order: {
                AMEC_SDS_ID: 'ASC',
            },
        });
    }

    enable(id: number, ownerCode: string, userUpdate: string) {
        return this.getRepository(STY_CHEMICAL_SECTION).update(
            { AMEC_SDS_ID: id, OWNERCODE: ownerCode },
            { STATUS: 1, USER_UPDATE: userUpdate },
        );
    }

    disable(id: number, ownerCode: string, userUpdate: string) {
        return this.getRepository(STY_CHEMICAL_SECTION).update(
            { AMEC_SDS_ID: id, OWNERCODE: ownerCode },
            { STATUS: 0, USER_UPDATE: userUpdate },
        );
    }

    disableById(id: number, userUpdate: string) {
        return this.getRepository(STY_CHEMICAL_SECTION).update(
            { AMEC_SDS_ID: id },
            { STATUS: 0, USER_UPDATE: userUpdate },
        );
    }
}
