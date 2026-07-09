import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreatePsdlcReqFormDto } from './dto/create-ps-dlc.dto';
import { PSDLC_DETAIL } from 'src/common/Entities/webform/table/PSDLC_DETAIL.entity';
import { PSDLC_FORM } from 'src/common/Entities/webform/table/PSDLC_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PSDLCReportDto } from './dto/report-ps-dlc.dto';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';

@Injectable()
export class PSDLCRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async createDetails(dto: CreatePsdlcReqFormDto) {
        return this.getRepository(PSDLC_DETAIL).save(dto);
    }

    async createForm(dto: CreatePsdlcReqFormDto) {
        return this.getRepository(PSDLC_FORM).save(dto);
    }

    async findOne(dto: FormDto) {
        return this.manager
            .createQueryBuilder(PSDLC_FORM, 'req')
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
            .createQueryBuilder(PSDLC_DETAIL, 'list')
            .where('list.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('list.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('list.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('list.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('list.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .orderBy('list.SEQNO', 'ASC')
            .getMany();
    }

    async findOneList(dto: FormDto) {
        const form = await this.findOne(dto);
        const list = await this.findList(dto);

        return {
            ...form,
            DETAILS: list,
        };
    }

    async search(dto: PSDLCReportDto) {
        const query = this.manager
            .createQueryBuilder(PSDLC_FORM, 'f')
            .innerJoin(
                PSDLC_DETAIL,
                'd',
                'f.NFRMNO = d.NFRMNO AND f.VORGNO = d.VORGNO AND f.CYEAR = d.CYEAR AND f.CYEAR2 = d.CYEAR2 AND f.NRUNNO = d.NRUNNO',
            )
            .innerJoin(
                FORM,
                'F',
                `f.NFRMNO = F.NFRMNO
                                AND f.VORGNO = F.VORGNO
                                AND f.CYEAR = F.CYEAR
                                AND f.CYEAR2 = F.CYEAR2
                                AND f.NRUNNO = F.NRUNNO`,
            )
            .innerJoin(
                FORMMST,
                'FM',
                `f.NFRMNO = FM.NNO
                                AND f.VORGNO = FM.VORGNO
                                AND f.CYEAR = FM.CYEAR`,
            )
            .addSelect('F.VREQNO', 'VREQNO')
            .addSelect('FM.VANAME', 'VANAME')
            .addSelect('d');
        if (dto.DRAWING) {
            query.andWhere('d.DRAWING LIKE :DRAWING', {
                DRAWING: `%${dto.DRAWING || ''}%`,
            });
        }
        if (dto.NEWCODE) {
            query.andWhere('d.NEWCODE LIKE :NEWCODE', {
                NEWCODE: `%${dto.NEWCODE || ''}%`,
            });
        }
        if (dto.OLDCODE) {
            query.andWhere('d.OLDCODE LIKE :OLDCODE', {
                OLDCODE: `%${dto.OLDCODE || ''}%`,
            });
        }
        if (dto.CHANGE_SCHD) {
            query.andWhere('f.CHANGE_SCHD LIKE :CHANGE_SCHD', {
                CHANGE_SCHD: `%${dto.CHANGE_SCHD || ''}%`,
            });
        }
        return query.getRawMany();
    }

    async updateDLCform(
        form: FormDto,
        status: string,
        date: Date,
        updateby: string,
    ) {
        return this.getRepository(PSDLC_FORM).update(form, {
            CHANGE_STATUS: status,
            ACTUAL_DATE: date,
            ACTUAL_UPDATEBY: updateby,
        });
    }
}
