import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PUREVA_FORM } from 'src/common/Entities/webform/table/PUREVA_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurevaFormDto } from './dto/create-pureva_form.dto';


@Injectable()
export class PurevaFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getData(dto: FormDto) {
                return await this.getRepository(PUREVA_FORM).findOne({
                    where: {
                        ...dto,
                    },
                    relations: {
                        PROFIT_TURNOVERS:true,
                        SCORES:true,
                        RELATIONS:true,
                        ADDRESSES: true,
                        FILES: true,
                        TERM:true,
                        STDCUR:true,
                        VORG:true,
                    },
                });
        }

    async insert(dto: CreatePurevaFormDto) {
        return this.getRepository(PUREVA_FORM).insert(dto);
    }

    async create(dto: CreatePurevaFormDto) {
        return this.getRepository(PUREVA_FORM).save(dto);
    }


}
