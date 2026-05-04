import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_TYPE } from 'src/common/Entities/gpreport/table/STY_TYPE.entity';
import { STY_IMAGE } from 'src/common/Entities/gpreport/table/STY_IMAGE.entity';
import { CreateStyImageDto } from './dto/create-sty-image.dto';

@Injectable()
export class StyImageRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateStyImageDto) {
        return this.getRepository(STY_IMAGE).save(dto);
    }
}
