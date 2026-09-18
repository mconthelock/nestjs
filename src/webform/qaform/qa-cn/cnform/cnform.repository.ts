import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreateCnformDto } from './dto/create-cnform.dto';
import { UpdateCnformDto } from './dto/update-cnform.dto';
import { CNFORM } from 'src/common/Entities/webform/table/CNFORM.entity';

@Injectable()
export class CnFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateCnformDto) {
        return this.getRepository(CNFORM).insert(dto);
    }

    async create(dto: CreateCnformDto) {
        return this.getRepository(CNFORM).save(dto);
    }

    async update(con: FormDto, dto: UpdateCnformDto): Promise<boolean> {
        const result = await this.getRepository(CNFORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }
}
