import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHM_SEC } from 'src/common/Entities/gpreport/views/STY_CHM_SEC.entity';
import { STY_CHEMICAL_SECTION } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_SECTION.entity';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';
import { User as WebformUser } from 'src/common/Entities/webform/views/AMECUSERALL.entity';
import { SectionSubscriber } from '../subscriber/section.subscriber';
import type { UpdateChemicalSectionDto } from '../dto/update-chemical-section.dto';

@Injectable()
export class SectionRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
        ds.subscribers.push(new SectionSubscriber());
    }

    getMasterSection(ownerCode: string) {
        return this.getRepository(STY_CHEMICAL_SECTION)
            .createQueryBuilder('S')
            .select([
                'S.AMEC_SDS_ID',
                'M.CHEMICAL_NAME',
                'M.REV',
                'M.EFFECTIVE_DATE',
                'S.RECEIVED_SDS_DATE',
                'M.PRODUCT_CODE',
                'S.USED_FOR',
                'S.USED_AREA',
                'S.KEEPING_POINT',
                'S.QTY',
                'S.REC4052',
                'S.REC4054',
                'M.UN_CLASS',
                'T.TYPE_NAME',
            ])
            .innerJoinAndSelect('S.MASTER', 'M')
            .leftJoin('M.CLASS', 'T', 'T.TYPE_STATUS = 1')
            .leftJoinAndSelect('M.FILES', 'F', 'F.STATUS = 1')
            .leftJoinAndSelect('F.TYPE', 'FT')
            .leftJoinAndSelect('S.DETAIL', 'D')
            .leftJoinAndSelect('D.SWCARCINOGENS_TYPE', 'CT')
            .where('S.OWNERCODE = :ownerCode', { ownerCode })
            .andWhere('S.STATUS = :status', { status: 1 })
            .orderBy('S.AMEC_SDS_ID', 'ASC')
            .getMany();
        // return this.getRepository(STY_CHM_SEC).find({
        //     select: [
        //         'AMEC_SDS_ID',
        //         'CHEMICAL_NAME',
        //         'REV',
        //         'EFFECTIVE_DATE',
        //         'RECEIVED_SDS_DATE',
        //         'USED_FOR',
        //         'USED_AREA',
        //         'KEEPING_POINT',
        //         'QTY',
        //         'REC4052',
        //         'REC4054',
        //         'CLASS',
        //         'CLASSNAME',
        //     ],
        //     where: {
        //         OWNERCODE: ownerCode,
        //         STATUS: 1,
        //     },
        //     order: {
        //         AMEC_SDS_ID: 'ASC',
        //     },
        // });
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

    getMailManagerbyId(id: number) {
        // SELECT C.OWNER, c.OWNERCODE , C.AMEC_SDS_ID, O.VPOSNO, O.VEMPNO, A.SNAME, A.SRECMAIL
        // FROM STY_CHEMICAL_SECTION C
        // JOIN WEBFORM.ORGPOS O ON C.OWNERCODE = O.VORGNO AND VPOSNO IN ('30','20')
        // JOIN WEBFORM.AMECUSERALL A ON O.VEMPNO = A.SEMPNO
        // WHERE C.AMEC_SDS_ID = 6
        return this.getRepository(STY_CHEMICAL_SECTION)
            .createQueryBuilder('S')
            .innerJoin(
                ORGPOS,
                'O',
                'S.OWNERCODE = O.VORGNO AND O.VPOSNO IN (:...posNos)',
                {
                    posNos: ['30', '20'],
                },
            )
            .innerJoin(WebformUser, 'A', 'O.VEMPNO = A.SEMPNO')
            .select([
                'S.OWNER',
                'S.OWNERCODE',
                'S.AMEC_SDS_ID',
                'O.VPOSNO',
                'O.VEMPNO',
                'A.SNAME',
                'A.SRECMAIL',
            ])
            .where('S.AMEC_SDS_ID = :id', { id })
            .getRawMany();
    }

    update(
        condition: Pick<
            UpdateChemicalSectionDto,
            'AMEC_SDS_ID' | 'OWNERCODE'
        >,
        data: Omit<UpdateChemicalSectionDto, 'AMEC_SDS_ID' | 'OWNERCODE'>,
    ) {
        return this.getRepository(STY_CHEMICAL_SECTION).update(condition, data);
    }
}
