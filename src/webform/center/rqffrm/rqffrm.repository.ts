import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FormDto } from '../form/dto/form.dto';
import { RQFFRM } from 'src/common/Entities/webform/table/RQFFRM.entity';

@Injectable()
export class RqffrmRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findOne(form: FormDto) {
        return this.getRepository(RQFFRM).findOneBy(form);
    }

    findFromYear(FYear: string){
        return this.getRepository(RQFFRM).find({
            where: {
                FYEAR: FYear,
            },
            relations:{
                RQFLIST: {
                    PVENDER: true
                }
            },
        });
    }
}
