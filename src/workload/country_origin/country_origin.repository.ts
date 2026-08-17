import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateCountryOriginDto } from './dto/create_country_origin.dto';
import { COUNTRY_ORIGIN } from 'src/common/Entities/workload/table/COUNTRY_ORIGIN.entity';

@Injectable()
export class CountryOriginRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    save(data: CreateCountryOriginDto| CreateCountryOriginDto[]) {
        if(Array.isArray(data)){
            return this.getRepository(COUNTRY_ORIGIN).save(data, {
                chunk: 500, // แบ่งการบันทึกเป็นกลุ่มละ 500 แถว
            });
        }
        return this.getRepository(COUNTRY_ORIGIN).save(data);
    }

    delete(code: string) {
        return this.getRepository(COUNTRY_ORIGIN).delete({ BULKCODE: code });
    }
}
