import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EBGREQFORM } from 'src/common/Entities/ebudget/table/EBGREQFORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreateEbgreqformDto } from './dto/create-ebgreqform.dto';

@Injectable()
export class EbgreqformRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findOne(form: FormDto) {
        return this.getRepository(EBGREQFORM).findOneBy(form);
    }

    async create(dto: CreateEbgreqformDto) {
        return this.getRepository(EBGREQFORM).save(dto);
    }
}
