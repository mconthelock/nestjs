import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';
import { CreateHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';
import { MAR_FILE } from 'src/common/Entities/webform/table/MAR_FILE.entity';

@Injectable()
export class MarFileRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getFile(dto: SearchHandleFileFormDto) {
        return this.getRepository(MAR_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'ASC',
            },
        });
    }

    async create(dto: CreateHandleFileFormDto) {
        return await this.getRepository(MAR_FILE).save(dto);
    }
}
