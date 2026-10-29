import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import {
    ReasonKeyDto,
    CreateReasonDto,
    UpdateReasonDto,
    FindReasonDto,
    OrderKeyDto,
    CreateOrderDto,
    UpdateOrderDto,
    FindOrderDto,
    FileKeyDto,
    CreateFileDto,
    UpdateFileDto,
    FindFileDto,
} from './dto/ps-adj.dto';
import { ADJREASONMST } from 'src/common/Entities/webform/table/ADJREASONMST.entity';
import { ADJORDREQ } from 'src/common/Entities/webform/table/ADJORDREQ.entity';
import { ADJODRATTFILE } from 'src/common/Entities/webform/table/ADJODRATTFILE.entity';

@Injectable()
export class PsAdjRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }
    createReason(dto: CreateReasonDto) {
        return this.getRepository(ADJREASONMST).insert(dto);
    }
    findReason(key: FindReasonDto) {
        return this.getRepository(ADJREASONMST).find({
            where: key,
            order: { REASONNO: 'ASC' },
            take: 100,
        });
    }
    updateReason(key: ReasonKeyDto, dto: UpdateReasonDto) {
        return this.getRepository(ADJREASONMST).update(key, dto);
    }
    deleteReason(key: ReasonKeyDto) {
        return this.getRepository(ADJREASONMST).delete(key);
    }
    existsByDrawing(DWGNO: string) {
        return this.getRepository(ADJORDREQ).existsBy({ DWGNO });
    }
    insert_adjust(dto: CreateOrderDto) {
        return this.getRepository(ADJORDREQ).insert(dto);
    }
    findOrder(key: FindOrderDto) {
        return this.getRepository(ADJORDREQ).find({
            where: key,
            order: {
                NFRMNO: 'ASC',
                VORGNO: 'ASC',
                CYEAR: 'ASC',
                CYEAR2: 'ASC',
                NRUNNO: 'ASC',
                CNTLNO: 'ASC',
            },
            take: 100,
        });
    }
    updateOrder(key: OrderKeyDto, dto: UpdateOrderDto) {
        return this.getRepository(ADJORDREQ).update(key, dto);
    }
    deleteOrder(key: OrderKeyDto) {
        return this.getRepository(ADJORDREQ).delete(key);
    }
    insert_files_adjust(dto: CreateFileDto) {
        return this.getRepository(ADJODRATTFILE).insert(dto);
    }
    findFile(key: FindFileDto) {
        return this.getRepository(ADJODRATTFILE).find({
            where: key,
            order: {
                NFRMNO: 'ASC',
                VORGNO: 'ASC',
                CYEAR: 'ASC',
                CYEAR2: 'ASC',
                NRUNNO: 'ASC',
                ID: 'ASC',
            },
            take: 100,
        });
    }
    updateFile(key: FileKeyDto, dto: UpdateFileDto) {
        return this.getRepository(ADJODRATTFILE).update(key, dto);
    }
    deleteFile(key: FileKeyDto) {
        return this.getRepository(ADJODRATTFILE).delete(key);
    }
}
