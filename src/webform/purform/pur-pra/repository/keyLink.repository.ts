import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_LINK_KEY_VIEW } from 'src/common/Entities/webform/views/PURPRA_LINK_KEY_VIEW.entity';
import { KeyLinkDto } from '../dto/key-link.dto';

@Injectable()
export class KeyLinkRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findOne(data: KeyLinkDto) {
        return this.getRepository(PURPRA_LINK_KEY_VIEW).findOne({ where: data });
    }
}
