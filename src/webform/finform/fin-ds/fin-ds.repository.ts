import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";

import { DSDUTYSTAMP } from 'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity';
import { DSREQDETAIL } from 'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity';
import { DSREQHEAD } from 'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity';

import { BaseRepository } from "src/common/repositories/base-repository";
import { DataSource } from "typeorm";

@Injectable()
export class FinDsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
    ) {
        super(ds);
    }

    findall() {
        return this.getRepository(DSDUTYSTAMP).find({
            where: {
                ACTIVE: "1"
            },
            order: {
                DUTY_VALUE: 'asc'
            }
        });
    }

    // ดึงรายการ Head ทั้งหมด สำหรับหน้า show
    async findAllHead() {
        return this.getRepository(DSREQHEAD).find({
            order: {
                NRUNNO: 'desc'
            }
        });
    }

    // ดึง Head ตามเลขฟอร์ม
    async findHeadByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        nrunno: number,
    ) {
        return this.getRepository(DSREQHEAD).findOne({
            where: {
                NFRMNO: nfrmno,
                VORGNO: vorgno,
                CYEAR: cyear,
                NRUNNO: nrunno,
            }
        });
    }

    // ดึง Detail ตามเลขฟอร์ม
    async findDetailByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        nrunno: number,
    ) {
        return this.getRepository(DSREQDETAIL).find({
            where: {
                NFRMNO: nfrmno,
                VORGNO: vorgno,
                CYEAR: cyear,
                NRUNNO: nrunno,
            },
            order: {
                LINEID: 'asc'
            }
        });
    }

    // ดึงทั้ง Head + Detail พร้อมกัน
    async findOneForShow(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        nrunno: number,
    ) {
        const head = await this.findHeadByForm(
            nfrmno,
            vorgno,
            cyear,
            nrunno,
        );

        const detail = await this.findDetailByForm(
            nfrmno,
            vorgno,
            cyear,
            nrunno,
        );

        return {
            head,
            detail,
        };
    }

    // CREATE HEAD prepare for create form
    async createHead(data: DSREQHEAD) {
        return this.getRepository(DSREQHEAD).save(data);
    }

    async createdetail(data: DSREQDETAIL) {
        return this.getRepository(DSREQDETAIL).save(data);
    }
}