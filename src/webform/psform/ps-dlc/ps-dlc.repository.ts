import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreatePsdlcReqFormDto } from './dto/create-ps-dlc.dto';
import { PSDLC_DETAIL } from 'src/common/Entities/webform/table/PSDLC_DETAIL.entity';
import { PSDLC_FORM } from 'src/common/Entities/webform/table/PSDLC_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PSRP_FORM } from 'src/common/Entities/webform/table/PSRP_FORM.entity';

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
}
