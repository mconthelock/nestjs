import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURNVF_FORM } from 'src/common/Entities/webform/table/PURNVF_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreatePurnvfFormDto } from './dto/create-purnvf_form.dto';

@Injectable()
export class PurnvfFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getData(dto: FormDto) {
            return await this.getRepository(PURNVF_FORM).findOne({
                where: {
                    ...dto,
                },
                relations: {
                    LISTS: {
                        TERM: true
                    },
                    ADDRESSES: true,
                    FILES: true,
                },
            });
    }

    async insert(dto: CreatePurnvfFormDto) {
        return this.getRepository(PURNVF_FORM).insert(dto);
    }

    async create(dto: CreatePurnvfFormDto) {
        return this.getRepository(PURNVF_FORM).save(dto);
    }

    async deleteById(dto: CreatePurnvfFormDto) {
        return this.getRepository(PURNVF_FORM).delete({ NFRMNO: dto.NFRMNO, VORGNO: dto.VORGNO, CYEAR: dto.CYEAR ,CYEAR2: dto.CYEAR2, NRUNNO: dto.NRUNNO });
    }
}
