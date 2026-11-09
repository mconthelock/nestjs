import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { PurVendor } from 'src/common/Entities/pursys/table/pur_vendor.entity';

@Injectable()
export class VendorsRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    createVendor(dto: any) {
        return this.getRepository(PurVendor).save(dto);
    }
}
