import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { pkForm } from '../interface/create.interface';
import { PURCPC_DETAILS } from 'src/common/Entities/webform/table/PURCPC_DETAILS.entity';
import type { CreatePcpDetailsDto } from '../dto/create-pcp-details.dto';

@Injectable()
export class PurCpcDetailRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: CreatePcpDetailsDto | CreatePcpDetailsDto[]) {
        if(Array.isArray(data)) {
            return this.getRepository(PURCPC_DETAILS).save(data, {
                chunk: 500, // ตัวอย่างการตั้งค่า chunk size
            });
        }
        return this.getRepository(PURCPC_DETAILS).save(data);
    }

    delete(pk: pkForm) {
        return this.getRepository(PURCPC_DETAILS).delete({
            CYEAR2: pk.CYEAR2,
            NRUNNO: pk.NRUNNO,
        });
    }
}
