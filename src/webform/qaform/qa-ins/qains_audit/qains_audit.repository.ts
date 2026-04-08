import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { QAINS_AUDIT } from 'src/common/Entities/webform/table/QAINS_AUDIT.entity';
import { CreateQainsAuditDto } from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';

@Injectable()
export class QainsAuditRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateQainsAuditDto) {
        return this.getRepository(QAINS_AUDIT).insert(dto);
    }

    async delete(dto: UpdateQainsAuditDto) {
        return this.manager.getRepository(QAINS_AUDIT).delete({
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2,
            NRUNNO: dto.NRUNNO,
            QAA_TYPECODE: dto.QAA_TYPECODE,
            QAA_AUDIT_SEQ: dto.QAA_AUDIT_SEQ,
        });
    }
}
