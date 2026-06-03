import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURNVF_LIST } from 'src/common/Entities/webform/table/PURNVF_LIST.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreatePurnvfListDto } from './dto/create-purnvf_list.dto';

@Injectable()
export class PurnvfListRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreatePurnvfListDto) {
        return this.getRepository(PURNVF_LIST).insert(dto);
    }

    async create(dto: CreatePurnvfListDto) {
        return this.getRepository(PURNVF_LIST).save(dto);
    }

    async deleteById(dto: CreatePurnvfListDto , LID: number) {
        return this.getRepository(PURNVF_LIST).delete({ NFRMNO: dto.NFRMNO, VORGNO: dto.VORGNO, CYEAR: dto.CYEAR ,CYEAR2: dto.CYEAR2, NRUNNO: dto.NRUNNO , LID : LID });
    }
}
