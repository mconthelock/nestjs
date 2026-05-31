import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { GPRB_PURPOSE } from 'src/common/Entities/webform/table/GPRB_PURPOSE.entity';
import { GPRB_STAMP_CONFIG } from 'src/common/Entities/webform/table/GPRB_STAMP_CONFIG.entity';
import { GPRB_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_STAMP_REQ.entity';

import { RB_CUS_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_CUS_STAMP_REQ.entity';

import { FormDto } from 'src/webform/center/form/dto/form.dto';
import { UpdateNamestampdto } from './dto/update-gp-rb.dto';
import { CreateStampReqDto } from './dto/create-gp-rb.dto';

@Injectable()
export class GpRbRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    findPurpose() {
        return this.getRepository(GPRB_PURPOSE).find();
    }

    findConfig() {
        return this.getRepository(GPRB_STAMP_CONFIG).find();
    }

    async findOne(dto: FormDto) {
        const qb = this.manager
            .createQueryBuilder(GPRB_STAMP_REQ, 'req')
            .leftJoinAndSelect('req.form', 'form')
            .where('req.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('req.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('req.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('req.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('req.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO });
        return qb.getOne();
    }

    async CreateStampReq(dto: CreateStampReqDto) {
        return this.getRepository(GPRB_STAMP_REQ).save(dto);
    }

    // async CreateCusStampReq(dto: CreateCusStampReqDto) {
    //     return this.getRepository(RB_CUS_STAMP_REQ).save({
    //         ...dto,
    //         REMARK: dto.STAMPCUS_REMARK,
    //     });
    // }

    async updateNameStamp(form: FormDto, name: string) {
        return this.getRepository(GPRB_STAMP_REQ).update(form, {
            NAME_STAMP: name,
        });
    }
}

// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
// @Injectable()
// export class ShowstampGpRbRepository extends BaseRepository {
//     constructor(@InjectDataSource('webformConnection') ds: DataSource) {
//         super(ds);
//     }
//     findAll() {
//         return this.getRepository(RB_STAMP_REQ).find();
//     }

//     async updateNameStamp(form: FormDto, name: string) {
//         return this.getRepository(RB_STAMP_REQ).update(form, {
//             NAME_STAMP: name,
//         });
//     }
// }

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
// @Injectable()
// export class ShowCusStampGpRbRepository extends BaseRepository {
//     constructor(@InjectDataSource('webformConnection') ds: DataSource) {
//         super(ds);
//     }
//     findAll() {
//         return this.getRepository(RB_CUS_STAMP_REQ).find();
//     }
//     async findOne(dto: FormDto) {
//         return this.getRepository(RB_CUS_STAMP_REQ).findOne({
//             where: {
//                 NFRMNO: dto.NFRMNO,
//                 VORGNO: dto.VORGNO,
//                 CYEAR: dto.CYEAR,
//                 CYEAR2: dto.CYEAR2,
//                 NRUNNO: dto.NRUNNO,
//             },
//         });
//     }
// }
