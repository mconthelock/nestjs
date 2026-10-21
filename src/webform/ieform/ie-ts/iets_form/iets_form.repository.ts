import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IETS_FORM } from 'src/common/Entities/webform/table/IETS_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreateIetsFormDto } from './dto/create-iets_form.dto';
import { UpdateIetsFormDto } from './dto/update-iets_form.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class IetsFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateIetsFormDto) {
        return this.getRepository(IETS_FORM).insert(dto);
    }

    async create(dto: CreateIetsFormDto) {
        return this.getRepository(IETS_FORM).save(dto);
    }

    async update(con: FormDto, dto: UpdateIetsFormDto): Promise<boolean> {
        const result = await this.getRepository(IETS_FORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }
}
