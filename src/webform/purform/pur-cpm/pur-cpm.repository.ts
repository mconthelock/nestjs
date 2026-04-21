import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURCPM_FORM } from 'src/common/Entities/webform/table/PURCPM_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { InsertPurCpmDto } from './dto/create-pur-cpm.dto';
import { UpdatePurCpmDto } from './dto/update-pur-cpm.dto';

@Injectable()
export class PurCpmRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findbyYear(year: string) {
        return this.manager.getRepository(PURCPM_FORM).find({
            where: {
                CYEAR2: year,
            },
            relations: {
                FILES: true,
            },
        });
    }

    async getData(dto: FormDto) {
        return await this.getRepository(PURCPM_FORM).findOne({
            where: {
                ...dto,
            },
            relations: {
                FILES: true,
            },
        });
    }

    async insert(dto: InsertPurCpmDto) {
        return await this.getRepository(PURCPM_FORM).insert(dto);
    }

    async update(condition: FormDto, data: UpdatePurCpmDto) {
        return await this.getRepository(PURCPM_FORM)
            .update(condition, data);
    }
}
