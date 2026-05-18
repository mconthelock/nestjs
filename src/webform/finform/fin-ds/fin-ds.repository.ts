import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";

import { DSDUTYSTAMP } from 'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity';
import { DSREQDETAIL } from 'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity';
import { DSREQHEAD } from 'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity';
import { FIN_FILE } from "src/common/Entities/webform/table/FIN_FILE.entity";

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

    async findAllHead() {
        return this.getRepository(DSREQHEAD).find({
            order: {
                NRUNNO: 'desc'
            }
        });
    }

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

    // ดึงไฟล์แนบของเอกสารนี้
    async findFilesByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        nrunno: number,
    ) {
        return this.getRepository(FIN_FILE).find({
            where: {
                NFRMNO: nfrmno,
                VORGNO: vorgno,
                CYEAR: cyear,
                NRUNNO: nrunno,
            },
            order: {
                FILE_ID: 'asc',
            },
        });
    }

    // ดึงไฟล์เดียวไว้ใช้ตอน download
    async findFileById(fileId: number) {
        return this.getRepository(FIN_FILE).findOne({
            where: {
                FILE_ID: fileId,
            },
        });
    }

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

        const files = await this.findFilesByForm(
            nfrmno,
            vorgno,
            cyear,
            nrunno,
        );

        return {
            head,
            detail,
            files,
        };
    }

    async createHead(data: DSREQHEAD) {
        return this.getRepository(DSREQHEAD).save(data);
    }

    async createdetail(data: DSREQDETAIL) {
        return this.getRepository(DSREQDETAIL).save(data);
    }
}