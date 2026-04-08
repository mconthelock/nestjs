import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REP } from 'src/common/Entities/webform/table/REP.entity';
import { SearchRepDto } from './dto/search-rep.dto';

@Injectable()
export class RepRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getRep(dto: SearchRepDto) {
        return this.getRepository(REP).find({ where: dto });
    }
}
