import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURNVF_FORM } from 'src/common/Entities/webform/table/PURNVF_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreatePurnvfAddressDto } from './dto/create-purnvf_address.dto';
import { PURNVF_ADDRESS } from 'src/common/Entities/webform/table/PURNVF_ADDRESS.entity';

@Injectable()
export class PurnvfAddressRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreatePurnvfAddressDto) {
        return this.getRepository(PURNVF_ADDRESS).insert(dto);
    }

    async create(dto: CreatePurnvfAddressDto) {
        return this.getRepository(PURNVF_ADDRESS).save(dto);
    }

    async deleteById(dto: CreatePurnvfAddressDto , id: number) {
        return this.getRepository(PURNVF_ADDRESS).delete({ NFRMNO: dto.NFRMNO, VORGNO: dto.VORGNO, CYEAR: dto.CYEAR ,CYEAR2: dto.CYEAR2, NRUNNO: dto.NRUNNO , ADDRID:id });
    }
}
