import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchPurFileDto } from './dto/search-pur-file.dto';
import { PUR_FILE } from 'src/common/Entities/webform/table/PUR_FILE.entity';
import { CreatePurFileDto } from './dto/create-pur-file.dto';

@Injectable()
export class PurFileRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getFile(dto: SearchPurFileDto) {
        return this.getRepository(PUR_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'ASC',
            },
        });
    }

    async getFileById(id: number) {
        return this.getRepository(PUR_FILE).findOne({
            where: { FILE_ID: id },
        });
    }

    async insert(dto: CreatePurFileDto) {
        return this.getRepository(PUR_FILE).insert(dto);
    }

    async deleteById(id: number) {
        return this.getRepository(PUR_FILE).delete({ FILE_ID: id });
    }
}
