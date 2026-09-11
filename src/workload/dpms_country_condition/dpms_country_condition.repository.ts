import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DpmsCountryConditionSubscriber } from './dpms_country_condition.subscriber';
import { DPMS_COUNTRY_CONDITION } from 'src/common/Entities/workload/table/DPMS_COUNTRY_CONDITION.entity';
import {
    CreateCountryConditionDto,
    DeleteCountryConditionDto,
} from './dto/dpms_country_condition.dto';

@Injectable()
export class DpmsCountryConditionRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
        ds.subscribers.push(new DpmsCountryConditionSubscriber()); // register Subscriber สำหรับ control การอัปเดต CREATEBY และ UPDATEBY
    }

    save(data: CreateCountryConditionDto | CreateCountryConditionDto[]) {
        if (Array.isArray(data)) {
            return this.getRepository(DPMS_COUNTRY_CONDITION).save(data, {
                chunk: 500, // แบ่งการบันทึกเป็นกลุ่มละ 500 แถว
            });
        }
        return this.getRepository(DPMS_COUNTRY_CONDITION).save(data);
    }

    delete(country: string, type: number) {
        return this.getRepository(DPMS_COUNTRY_CONDITION).delete({
            COUNTRY: country,
            TYPE: type,
        });
    }

    find(data: DeleteCountryConditionDto) {
        return this.getRepository(DPMS_COUNTRY_CONDITION).find({
            where: data,
        });
    }

    findByType(type: number) {
        return this.getRepository(DPMS_COUNTRY_CONDITION).find({
            where: {
                TYPE: type,
            },
        });
    }
}
