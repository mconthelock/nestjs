import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_REASONS } from 'src/common/Entities/webform/table/PURPRA_REASONS.entity';
import type { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class ReasonRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: PURPRA_REASONS | PURPRA_REASONS[]) {
        if (Array.isArray(data)) {
            return this.getRepository(PURPRA_REASONS).save(data, {
                chunk: 500, // ตัวอย่างการตั้งค่า chunk size
            });
        }
        return this.getRepository(PURPRA_REASONS).save(data);
    }

    delete(form: FormDto){
        return this.getRepository(PURPRA_REASONS).delete({
            NFRMNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
        });
    }
}
