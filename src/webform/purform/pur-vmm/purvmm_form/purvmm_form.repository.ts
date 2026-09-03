import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurvmmFormDto } from './dto/create-purvmm_form.dto';
import { UpdatePurvmmFormDto } from './dto/update-purvmm_form.dto';

@Injectable()
export class PurvmmFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
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
}
