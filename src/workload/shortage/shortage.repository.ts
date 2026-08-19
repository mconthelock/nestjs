import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { SHORTAGE_ISSUE } from "src/common/Entities/workload/views/SHORTAGE_ISSUE.entity";
import { VW_SHORTAGE_REPORT } from "src/common/Entities/workload/views/SHORTAGE_REPORT.entity";
import { SHORT_PUR_TRACKING } from "src/common/Entities/workload/table/SHORT_PUR_TRACKING.entity";
import { BaseRepository } from "src/common/repositories/base-repository";
import { DataSource } from "typeorm";
import { CreatePurTrackingDto } from "./dto/create-purtracking.dto";
import { UpdatePurTrackingDto } from "./dto/update-purtracking.dto";

//ติดต่อ กับฐานข้อมูล workload
@Injectable()
export class ShortageRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private ds: DataSource,
    ) {
        super(ds);
    }
    /**
     * get_headprod5
     * @description ดึงข้อมูล shortage issue 5 column แรก
     * @returns 
     */
    async get_headprod5() {
        return this.getRepository(SHORTAGE_ISSUE).find({take:1});
    }
    
    async get_shortagereport() {
        return this.getRepository(VW_SHORTAGE_REPORT).find({
        order: {
            //BUYER: 'ASC',      // จัดกลุ่ม Buyer ก่อน
            //JOBITEM: 'ASC',    // ตามด้วย Job Item
            ITEM: 'ASC',       // และ Item 
        }
    });  
  }

    async get_shortagereport_noentity(){
        return this.getRepository(VW_SHORTAGE_REPORT)
        .createQueryBuilder('report')
        .getMany();   
    }
    
    /**
     * get_shortagereport_sql
     * @description ดึงข้อมูล shortage report โดยใช้ sql query
     * @returns 
     */
    async get_shortagereport_sql(){
        return this.manager.query(`SELECT * FROM WORKLOAD.VW_SHORTAGE_REPORT`);
    }

    /**
     * create_short_pur_tracking
     * @description เพิ่มข้อมูล short_pur_tracking  
     * @param data 
     * @returns 
     */
    async create_short_pur_tracking(data: CreatePurTrackingDto) {
        return this.getRepository(SHORT_PUR_TRACKING).save(data)
    }

    /**
     * update_short_pur_tracking
     * @description update ข้อมูล short_pur_tracking
     * @param id  
     * @param data 
     * @returns 
     */
    async update_short_pur_tracking(
    {PONO,PPROD,PLINE,PORD}: {
    PONO: number;
    PPROD: string;
    PLINE: number;
    PORD: number;
   },
   data: UpdatePurTrackingDto,) {
        return this.getRepository(SHORT_PUR_TRACKING).update({PONO, PPROD, PLINE, PORD}, data);
   }

}