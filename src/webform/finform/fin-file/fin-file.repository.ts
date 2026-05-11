import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';
import { CreateHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';
import { FIN_FILE } from 'src/common/Entities/webform/table/FIN_FILE.entity';

@Injectable()
export class FinFileRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getFile(dto: SearchHandleFileFormDto) {
        return this.getRepository(FIN_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'ASC',
            },
        });
    }

    async create(dto: CreateHandleFileFormDto) {
        return await this.getRepository(FIN_FILE).save(dto);
    }
}
