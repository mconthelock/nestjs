import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";

import {DSDUTYSTAMP } from  'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity'
import {DSREQDETAIL } from  'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity'
import {DSSTOCK } from  'src/common/Entities/webform/table/FINDS_STOCK.entity'
import {DSREQHEAD } from  'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity'

import { BaseRepository } from "src/common/repositories/base-repository";
import { DataSource } from "typeorm";

@Injectable()
export class FinDsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,

    ){
        super(ds);
    }
//   super(ds);   =  เป็นการนำค่าไปเก็บแกล้วใช้ใน BaseRepository

    findall(){
        return this.getRepository(DSDUTYSTAMP).find({
            where: {
                ACTIVE : "1"
            }
        });

        // this.manager.getRepository(GA_REQ_CATEGORY).find();
    }
}