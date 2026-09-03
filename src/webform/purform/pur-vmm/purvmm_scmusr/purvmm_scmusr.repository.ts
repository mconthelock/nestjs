import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURVMM_SCMUSR } from 'src/common/Entities/webform/table/PURVMM_SCMUSR.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurVmmScmusrDto } from './dto/create-purvmm_scmusr.dto';
import { UpdatePurVmmDto } from '../dto/update-pur-vmm.dto';

@Injectable()
export class PurvmmScmuserRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreatePurVmmScmusrDto) {
        return this.getRepository(PURVMM_SCMUSR).insert(dto);
    }

    async create(dto: CreatePurVmmScmusrDto) {
        return this.getRepository(PURVMM_SCMUSR).save(dto);
    }

    async update(con: FormDto, dto: UpdatePurVmmDto): Promise<boolean> {
        const result = await this.getRepository(PURVMM_SCMUSR).update(con, dto);
        return (result.affected ?? 0) > 0;
    }
}
