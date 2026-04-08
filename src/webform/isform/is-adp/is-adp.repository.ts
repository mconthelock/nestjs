import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ISADP_FORM } from 'src/common/Entities/webform/table/ISADP_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class IsAdpRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(data: ISADP_FORM[]) {
        return await this.getRepository(ISADP_FORM).insert(data);
    }

    async getData(dto: FormDto) {
        return this.manager
            .createQueryBuilder()
            .from('ISADP_FORM', 'a')
            .select([
                '"a"."NFRMNO"',
                '"a"."VORGNO"',
                '"a"."CYEAR"',
                '"a"."CYEAR2"',
                '"a"."NRUNNO"',
                '"a"."PLANYEAR"',
                '"a"."REQ_DIV"',
                '"a"."USER_REQ"',
                '"a"."DEV_PLAN"',
                '"a"."MANHOUR" as "MH"',
                '"a"."COST"',
                '"b"."SDIV"',
            ])
            .where('a.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('a.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('a.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('a.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('a.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .leftJoin(
                (qb) => qb.from('AMEC.PDIVISION', 'b'),
                'b',
                'a.REQ_DIV ="b"."SDIVCODE"',
            )
            .orderBy('a.REQ_DIV', 'ASC')
            .getRawMany();
    }
}
