import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreatePsrpReqFormDto } from './dto/create-ps-rp.dto';
import { PSRP_LIST } from 'src/common/Entities/webform/table/PSRP_LIST.entity';
import { PSRP_FORM } from 'src/common/Entities/webform/table/PSRP_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Injectable()
export class PsRPRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async CreatePSrpReqList(dto: CreatePsrpReqFormDto) {
        return this.getRepository(PSRP_LIST).save(dto);
    }

    async CreatePSrpForm(dto: CreatePsrpReqFormDto) {
        return this.getRepository(PSRP_FORM).save(dto);
    }

    async findOne(dto: FormDto) {
        return this.manager
            .createQueryBuilder(PSRP_FORM, 'req')
            .leftJoinAndSelect('req.form', 'form')
            .leftJoinAndSelect('req.formmaster', 'formmst')
            .where('req.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('req.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('req.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('req.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('req.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .getOne();
    }

    async findList(dto: FormDto) {
        return this.manager
            .createQueryBuilder(PSRP_LIST, 'list')
            .where('list.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('list.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('list.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('list.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('list.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .orderBy('list.LINEID', 'ASC')
            .getMany();
    }

    async findOneWithList(dto: FormDto) {
        const form = await this.findOne(dto);
        const list = await this.findList(dto);

        return {
            ...form,
            DETAILS: list,
        };
    }

    async search(dto: {
        fromDate?: string;
        toDate?: string;
        pItem?: string;
        issueNo?: string;
        issueTo?: string;
        fromSch?: string;
        toSch?: string;
    }) {
        const qb = this.manager
            .createQueryBuilder(PSRP_LIST, 'list')
            .innerJoin(
                FORM,
                'F',
                `list.NFRMNO = F.NFRMNO
        AND list.VORGNO = F.VORGNO
        AND list.CYEAR = F.CYEAR
        AND list.CYEAR2 = F.CYEAR2
        AND list.NRUNNO = F.NRUNNO`,
            )
            .innerJoin(
                FORMMST,
                'FM',
                `list.NFRMNO = FM.NNO
        AND list.VORGNO = FM.VORGNO
        AND list.CYEAR = FM.CYEAR`,
            )
            .innerJoin(
                FLOW,
                'FL',
                `list.NFRMNO = FL.NFRMNO
        AND list.VORGNO = FL.VORGNO
        AND list.CYEAR = FL.CYEAR
        AND list.CYEAR2 = FL.CYEAR2
        AND list.NRUNNO = FL.NRUNNO
        AND FL.CEXTDATA = '02'`,
            )
            .addSelect('FM.VANAME', 'VANAME')
            .addSelect('FL.DAPVDATE', 'DAPVDATE');

        if (dto.fromDate?.trim()) {
            qb.andWhere(
                `TRUNC(F.DREQDATE) >= TRUNC(TO_DATE(:fromDate, 'YYYY-MM-DD'))`,
                { fromDate: dto.fromDate.trim() },
            );
        }

        if (dto.toDate?.trim()) {
            qb.andWhere(
                `TRUNC(F.DREQDATE) <= TRUNC(TO_DATE(:toDate, 'YYYY-MM-DD'))`,
                { toDate: dto.toDate.trim() },
            );
        }

        if (dto.pItem?.trim()) {
            qb.andWhere(`UPPER(TRIM(list.PURCODE)) = UPPER(:pItem)`, {
                pItem: dto.pItem.trim(),
            });
        }

        // issueNo = ISSUECARD
        if (dto.issueNo?.trim()) {
            qb.andWhere(`UPPER(TRIM(list.ISSUECARD)) = UPPER(:issueNo)`, {
                issueNo: dto.issueNo.trim(),
            });
        }

        if (dto.issueTo?.trim()) {
            qb.andWhere(`UPPER(TRIM(list.ISSUETO)) = UPPER(:issueTo)`, {
                issueTo: dto.issueTo.trim(),
            });
        }

        if (dto.fromSch?.trim()) {
            qb.andWhere(`list.PRODUCTION >= :fromSch`, {
                fromSch: dto.fromSch.trim(),
            });
        }

        if (dto.toSch?.trim()) {
            qb.andWhere(`list.PRODUCTION <= :toSch`, {
                toSch: dto.toSch.trim(),
            });
        }

        return qb
            .orderBy('list.NFRMNO', 'ASC')
            .addOrderBy('list.VORGNO', 'ASC')
            .addOrderBy('list.CYEAR', 'ASC')
            .addOrderBy('list.CYEAR2', 'ASC')
            .addOrderBy('list.NRUNNO', 'ASC')
            .addOrderBy('list.LINEID', 'ASC')
            .getRawMany();
    }
}
