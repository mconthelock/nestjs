import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { getData } from './dto/searchJ002.dto';
import { J002MP } from 'src/common/Entities/datacenter/table/J002MP.entity';

@Injectable()
export class J002mpRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    searchData( dto: getData){
        return this.getRepository(J002MP).find({where: {
            J2INO: dto.PURITEM,
            J2ODR: dto.ISSUENO,
            J2MTH: dto.SCHEDULE,
            J2TO: dto.ISSUETO,
            J2CUS: dto.ORDER,
            J2IINO: dto.ITEM,
            J2SEQ: Not(0),
        }});
      }

}
