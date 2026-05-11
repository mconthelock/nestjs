import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    CreateStinpFormListDto,
    PrimaryKeyStinpFormListDto,
} from './dto/create-stinp-form-list.dto';
import { STINP_FORM_LIST } from 'src/common/Entities/gpreport/table/STINP_FORM_LIST.entity';
import { UpdateStinpFormListDto } from './dto/update-stinp-form-list.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
@Injectable()
export class StinpFormListRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateStinpFormListDto) {
        return this.getRepository(STINP_FORM_LIST).save(dto);
    }

    async update(
        condition: PrimaryKeyStinpFormListDto,
        data: UpdateStinpFormListDto,
    ) {
        return this.getRepository(STINP_FORM_LIST).update(condition, data);
    }

    async findOne(condition: PrimaryKeyStinpFormListDto) {
        return this.getRepository(STINP_FORM_LIST).findOne({
            where: condition,
        });
    }

    async find(form: FormDto) {
        return this.getRepository(STINP_FORM_LIST).find({
            where: form,
        });
    }

    async delete(condition: PrimaryKeyStinpFormListDto) {
        return this.getRepository(STINP_FORM_LIST).delete(condition);
    }
}
