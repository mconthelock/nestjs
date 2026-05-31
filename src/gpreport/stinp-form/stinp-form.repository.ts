import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateStinpFormDto } from './dto/create-stinp-form.dto';
import { STINP_FORM } from 'src/common/Entities/gpreport/table/STINP_FORM.entity';
import { UpdateStinpFormDto } from './dto/update-stinp-form.dto';
import { FormDto } from 'src/webform/center/form/dto/form.dto';
@Injectable()
export class StinpFormRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateStinpFormDto) {
        return this.getRepository(STINP_FORM).save(dto);
    }

    async update(condition: FormDto, data: UpdateStinpFormDto) {
        return this.getRepository(STINP_FORM).update(condition, data);
    }

    async findOne(condition: FormDto) {
        return this.getRepository(STINP_FORM).findOne({
            where: condition,
        });
    }
}
