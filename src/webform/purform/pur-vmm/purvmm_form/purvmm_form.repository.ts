import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurvmmFormDto } from './dto/create-purvmm_form.dto';
import { UpdatePurvmmFormDto } from './dto/update-purvmm_form.dto';
import { SearchPurvmmFormDto } from './dto/search-purvmm_form.dto';
import { traceDeprecation } from 'process';

@Injectable()
export class PurvmmFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getData(dto: FormDto) {
        return await this.getRepository(PURVMM_FORM).findOne({
            where: {
                ...dto,
            },
            relations: {
                ADDRESSES: true,
                FILES: true,
                VENDER: true,
                SCMUSER: true,
                FORM: true,
                TERM: true,
                CURRENCY: true,
                TRADE: true,
            },
        });
    }

    async insert(dto: CreatePurvmmFormDto) {
        return this.getRepository(PURVMM_FORM).insert(dto);
    }

    async create(dto: CreatePurvmmFormDto) {
        return this.getRepository(PURVMM_FORM).save(dto);
    }

    async update(con: FormDto, dto: UpdatePurvmmFormDto): Promise<boolean> {
        const result = await this.getRepository(PURVMM_FORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async search(dto: SearchPurvmmFormDto) {
        const qb = this.getRepository(PURVMM_FORM)
            .createQueryBuilder('vmm')
            .leftJoinAndSelect('vmm.FORM', 'vmmform')
            .leftJoinAndSelect('vmmform.reqtor', 'reqtor')
            .leftJoinAndSelect('vmmform.creator', 'creator')
            .leftJoinAndSelect('vmm.TRADE', 'trade')
            .leftJoinAndSelect('vmm.TERM', 'term')
            .leftJoinAndSelect('vmmform.flow', 'flow')
            .leftJoinAndSelect('vmm.ADDRESSES', 'addresses');

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

        if (dto.VENDNAME) {
            cond.AND.push({
                field: 'VENDNAME',
                op: 'like',
                value: dto.VENDNAME,
            });
        }
        if (dto.vmmform.CST) {
            cond.AND.push({
                field: 'vmmform.CST',
                op: 'eq',
                value: dto.vmmform.CST,
            });
        }

        if (dto.vmmform.START_DREQDATE) {
            cond.AND.push({
                field: 'vmmform.DREQDATE',
                op: 'gte',
                value: dto.vmmform.START_DREQDATE,
            });
        }

        if (dto.vmmform.END_DREQDATE) {
            cond.AND.push({
                field: 'vmmform.DREQDATE',
                op: 'lte',
                value: dto.vmmform.END_DREQDATE,
            });
        }
        if (dto.vmmform.reqtor && dto.vmmform.reqtor.SEMPNO) {
            cond.AND.push({
                field: 'reqtor.SEMPNO',
                op: 'eq',
                value: dto.vmmform.reqtor.SEMPNO,
            });
        }

        if (dto.vmmform.reqtor && dto.vmmform.reqtor.SNAME) {
            cond.AND.push({
                field: 'reqtor.SNAME',
                op: 'like',
                value: dto.vmmform.reqtor.SNAME.toUpperCase(),
            });
        }

        if (dto.vmmform.reqtor && dto.vmmform.reqtor.SSECCODE) {
            cond.AND.push({
                field: 'reqtor.SSECCODE',
                op: 'eq',
                value: dto.vmmform.reqtor.SSECCODE,
            });
        }

        if (dto.vmmform.reqtor && dto.vmmform.reqtor.SDEPCODE) {
            cond.AND.push({
                field: 'reqtor.SDEPCODE',
                op: 'eq',
                value: dto.vmmform.reqtor.SDEPCODE,
            });
        }

        if (dto.vmmform.reqtor && dto.vmmform.reqtor.SDIVCODE) {
            cond.AND.push({
                field: 'reqtor.SDIVCODE',
                op: 'eq',
                value: dto.vmmform.reqtor.SDIVCODE,
            });
        }

        // if (dto.VENDGROUP == 'Direct') {
        //     cond.AND.push({
        //         field: 'VENDGROUP',
        //         op: 'notIn',
        //         value: ['6:Non-Production (6)', '8:Sub-Contractor (8)'],
        //     });
        // } else if (dto.VENDGROUP == 'Indirect') {
        //     cond.AND.push({
        //         field: 'VENDGROUP',
        //         op: 'eq',
        //         value: '6:Non-Production (6)',
        //     });
        // } else if (dto.VENDGROUP == 'Subcon') {
        //     cond.AND.push({
        //         field: 'VENDGROUP',
        //         op: 'eq',
        //         value: '8:Sub-Contractor (8)',
        //     });
        // }
        this.applyFilters(qb, 'vmm', cond, [
            'NRUNNO',
            'VENDCODE',
            'VENDNAME',
            'vmmform.CST',
            'vmmform.DREQDATE',
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
