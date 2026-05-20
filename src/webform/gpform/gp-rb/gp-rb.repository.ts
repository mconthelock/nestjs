import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RB_PURPOSE } from 'src/common/Entities/webform/table/GPRB_PURPOSE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreateCusStampReqDto, CreateGpRbDto, CreateStampReqDto } from './dto/create-gp-rb.dto';
import { UpdateNamestampdto } from './dto/update-gp-rb.dto';
import { RB_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_STAMP_REQ.entity';
import { RB_CUS_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_CUS_STAMP_REQ.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class GpRbRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }
    findAll() {
        return this.getRepository(RB_PURPOSE).find();
    }

    async CreateStampReq(dto:CreateStampReqDto) {
        return this.getRepository(RB_STAMP_REQ).save(dto);
    }

    async CreateCusStampReq(dto:CreateCusStampReqDto) {
        return this.getRepository(RB_CUS_STAMP_REQ).save({...dto, REMARK: dto.STAMPCUS_REMARK});
    }
}


// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
@Injectable()
export class ShowstampGpRbRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }
    findAll() {
        return this.getRepository(RB_STAMP_REQ).find();
    }
    async findOne(dto: FormDto)   {
        return this.getRepository(RB_STAMP_REQ).findOne({
            where: {
                NFRMNO: dto.NFRMNO, 
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            },
        });
    }

    async updateNameStamp(form: FormDto, name: string ) {
        return this.getRepository(RB_STAMP_REQ).update(form,
            {
                NAME_STAMP: name,
            },
        );
    }
}

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
@Injectable()
export class ShowCusStampGpRbRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }
    findAll() {
        return this.getRepository(RB_CUS_STAMP_REQ).find();
    }   
    async findOne(dto: FormDto)   {
        return this.getRepository(RB_CUS_STAMP_REQ).findOne({
            where: {
                NFRMNO: dto.NFRMNO, 
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            },
        });
    }   
}