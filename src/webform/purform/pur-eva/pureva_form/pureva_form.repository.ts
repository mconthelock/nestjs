import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PUREVA_FORM } from 'src/common/Entities/webform/table/PUREVA_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurevaFormDto } from './dto/create-pureva_form.dto';
import { UpdatePurevaFormDto } from './dto/update-pureva_form.dto';
import { SearchPurevaFormDto } from './dto/search-pureva_form.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class PurevaFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getData(dto: FormDto) {
        return await this.getRepository(PUREVA_FORM).findOne({
            where: {
                ...dto,
            },
            relations: {
                PROFIT_TURNOVERS: true,
                SCORES: true,
                RELATIONS: true,
                ADDRESSES: true,
                FILES: true,
                TERM: true,
                STDCUR: true,
                VORG: true,
                CAPCUR: true,
                FORM: true,
            },
        });
    }

    async insert(dto: CreatePurevaFormDto) {
        return this.getRepository(PUREVA_FORM).insert(dto);
    }

    async create(dto: CreatePurevaFormDto) {
        return this.getRepository(PUREVA_FORM).save(dto);
    }

    async update(con: FormDto, dto: UpdatePurevaFormDto): Promise<boolean> {
        const result = await this.getRepository(PUREVA_FORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async search(dto: SearchPurevaFormDto) {
        const qb = this.getRepository(PUREVA_FORM)
            .createQueryBuilder('eva')
            .leftJoinAndSelect('eva.FORM', 'evaform')
            .leftJoinAndSelect('evaform.reqtor', 'reqtor')
            .leftJoinAndSelect('eva.PROFIT_TURNOVERS', 'turnovers')
            .leftJoinAndSelect('eva.ADDRESSES', 'addresses')
            .leftJoinAndSelect('eva.SCORES', 'scores')
            .leftJoinAndSelect('eva.TERM', 'term')
            .leftJoinAndSelect('eva.STDCUR', 'stdcur')
            .leftJoinAndSelect('eva.CAPCUR', 'capcur')
            .leftJoinAndSelect('evaform.flow', 'flow');
        const cond = {
            AND: [],
        };

        if (dto.NRUNNO) {
            cond.AND.push({
                field: 'NRUNNO',
                op: 'eq',
                value: dto.NRUNNO,
            });
        }

        if (dto.VENDCODE) {
            cond.AND.push({
                field: 'VENDCODE',
                op: 'eq',
                value: dto.VENDCODE,
            });
        }

        if (dto.COMNAME) {
            cond.AND.push({
                field: 'COMNAME',
                op: 'like',
                value: dto.COMNAME,
            });
        }
        if (dto.evaform.CST) {
            cond.AND.push({
                field: 'evaform.CST',
                op: 'eq',
                value: dto.evaform.CST,
            });
        }

        if (dto.evaform.START_DREQDATE) {
            cond.AND.push({
                field: 'evaform.DREQDATE',
                op: 'gte',
                value: dto.evaform.START_DREQDATE,
            });
        }

        if (dto.evaform.END_DREQDATE) {
            cond.AND.push({
                field: 'evaform.DREQDATE',
                op: 'lte',
                value: dto.evaform.END_DREQDATE,
            });
        }
        if (dto.evaform.reqtor && dto.evaform.reqtor.SEMPNO) {
            cond.AND.push({
                field: 'reqtor.SEMPNO',
                op: 'eq',
                value: dto.evaform.reqtor.SEMPNO,
            });
        }

        if (dto.evaform.reqtor && dto.evaform.reqtor.SNAME) {
            cond.AND.push({
                field: 'reqtor.SNAME',
                op: 'eq',
                value: dto.evaform.reqtor.SNAME,
            });
        }

        if (dto.evaform.reqtor && dto.evaform.reqtor.SSECCODE) {
            cond.AND.push({
                field: 'reqtor.SSECCODE',
                op: 'eq',
                value: dto.evaform.reqtor.SSECCODE,
            });
        }

        if (dto.evaform.reqtor && dto.evaform.reqtor.SDEPCODE) {
            cond.AND.push({
                field: 'reqtor.SDEPCODE',
                op: 'eq',
                value: dto.evaform.reqtor.SDEPCODE,
            });
        }

        if (dto.evaform.reqtor && dto.evaform.reqtor.SDIVCODE) {
            cond.AND.push({
                field: 'reqtor.SDIVCODE',
                op: 'eq',
                value: dto.evaform.reqtor.SDIVCODE,
            });
        }

        if (dto.VENDGROUP == 'Direct') {
            cond.AND.push({
                field: 'VENDGROUP',
                op: 'notIn',
                value: ['6:Non-Production (6)', '8:Sub-Contractor (8)'],
            });
        } else if (dto.VENDGROUP == 'Indirect') {
            cond.AND.push({
                field: 'VENDGROUP',
                op: 'eq',
                value: '6:Non-Production (6)',
            });
        } else if (dto.VENDGROUP == 'Subcon') {
            cond.AND.push({
                field: 'VENDGROUP',
                op: 'eq',
                value: '8:Sub-Contractor (8)',
            });
        }

        this.applyFilters(qb, 'eva', cond, [
            'NRUNNO',
            'VENDCODE',
            'COMNAME',
            'VENDGROUP',
            'evaform.CST',
            'evaform.DREQDATE',
            'reqtor.SEMPNO',
            'reqtor.SNAME',
            'reqtor.SSECCODE',
            'reqtor.SDEPCODE',
            'reqtor.SDIVCODE',
        ]);
        // if (dto) await applyDynamicFilters(qb, dto, 'eva');
        return qb.getMany();
    }
}
