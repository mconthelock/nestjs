import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Raw } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHM_SEC } from 'src/common/Entities/gpreport/views/STY_CHM_SEC.entity';

@Injectable()
export class SectionRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
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

    getMasterSectionRebuild(
        id: number[],
        section: readonly { OWNER: string }[],
    ) {}
}
