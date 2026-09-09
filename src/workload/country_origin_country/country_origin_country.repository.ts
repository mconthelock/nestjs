import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { COUNTRY_ORIGIN_COUNTRY } from 'src/common/Entities/workload/table/COUNTRY_ORIGIN_COUNTRY.entity';
import { CreateCountryOriginCountryDto } from './dto/create_country_origin_country.dto';

@Injectable()
export class CountryOriginCountryRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getCountry() {
        return this.getRepository(COUNTRY_ORIGIN_COUNTRY)
            .createQueryBuilder('C')
            .distinct()
            .select('C.COUNTRY', 'COUNTRY')
            .orderBy('C.COUNTRY', 'ASC')
            .getRawMany();
    }

    async save(
        data: CreateCountryOriginCountryDto | CreateCountryOriginCountryDto[],
    ) {
        if (Array.isArray(data)) {
            const bulkCodes = [...new Set(data.map((item) => item.BULKCODE))];
            const CHUNK_SIZE = 500;
            //delete bulk code
            // ลบทีละ chunk
            for (let i = 0; i < bulkCodes.length; i += CHUNK_SIZE) {
                await this.getRepository(COUNTRY_ORIGIN_COUNTRY).delete({
                    BULKCODE: In(bulkCodes.slice(i, i + CHUNK_SIZE)),
                });
            }
            // if (bulkCodes.length > 0) {
            //     await this.getRepository(COUNTRY_ORIGIN_COUNTRY).delete({
            //         BULKCODE: In(bulkCodes),
            //     });
            // }

            return this.getRepository(COUNTRY_ORIGIN_COUNTRY).save(data, {
                chunk: 500, // แบ่งการบันทึกเป็นกลุ่มละ 500 แถว
            });
        }
        await this.getRepository(COUNTRY_ORIGIN_COUNTRY).delete({
            BULKCODE: data.BULKCODE,
        });
        return this.getRepository(COUNTRY_ORIGIN_COUNTRY).save(data);
    }
}
