import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/repositories/base-repository";
import { DataSource } from "typeorm";
import { CreatePSrpFormDto, CreatePsrpListDto, CreatePsrpReqFormDto } from "./dto/create-ps-rp.dto";
import { PSRP_LIST } from "src/common/Entities/webform/table/PSRP_LIST.entity";
import { PSRP_FORM } from "src/common/Entities/webform/table/PSRP_FORM.entity";


@Injectable()
export class PsRPRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async CreatePSrpReq(dto: CreatePsrpReqFormDto) {
        return this.getRepository(PSRP_LIST).save(dto);
    }

    async CreatePSrpForm(dto: CreatePsrpReqFormDto) {
        return this.getRepository(PSRP_FORM).save(dto);
    }
}