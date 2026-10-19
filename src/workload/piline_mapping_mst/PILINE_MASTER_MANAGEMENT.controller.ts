import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const MASTERS = {
    mapping: { table:'PILINE_MAPPING_MST', key:'MAP_ID', fields:{LOCATION_ID:0,CAUSE_ID:0,PROBLEM_ID:0,EVENT_ID:0}, unique:['LOCATION_ID','CAUSE_ID','PROBLEM_ID'] },
    initial: { table:'PILINE_INITIAL_MST', key:'INITIAL_ID', fields:{INITIAL_DETAIL:300}, unique:['INITIAL_DETAIL'] },
    location: { table:'PILINE_LOCATION_MST', key:'LOCATION_ID', fields:{LOCATION_NAME:100}, unique:['LOCATION_NAME'] },
    cause: { table:'PILINE_CAUSE_MST', key:'CAUSE_ID', fields:{CAUSE_NAME:300}, unique:['CAUSE_NAME'] },
    problem: { table:'PILINE_PROBLEM_MST', key:'PROBLEM_ID', fields:{PROBLEM_NAME:200}, unique:['PROBLEM_NAME'] },
    event: { table:'PILINE_EVENT_MST', key:'EVENT_ID', fields:{MAIN_CATEGORY:100,EVENT_TYPE:100,PRODUCTION_IMPACT:100}, unique:['MAIN_CATEGORY','EVENT_TYPE','PRODUCTION_IMPACT'] },
};

// PILINE-only management endpoints. Identifiers come only from this allowlist.
@Controller('workload/piline_master_management')
export class PilineMasterManagementController {
    constructor(@InjectDataSource('workloadConnection') private readonly db: DataSource) {}

    private config(kind: string) {
        if (!Object.prototype.hasOwnProperty.call(MASTERS,kind)) throw new BadRequestException('Unknown master');
        return MASTERS[kind] as {table:string;key:string;fields:Record<string,number>;unique:string[]};
    }

    private values(kind: string, body: Record<string,unknown>) {
        const config=this.config(kind);
        if (!body || typeof body!=='object' || Array.isArray(body)) throw new BadRequestException('Invalid data');
        const allowed=[...Object.keys(config.fields),'STATUS'];
        if (Object.keys(body).some(key=>!allowed.includes(key))) throw new BadRequestException('Unknown field');
        const values: Record<string,string|number>={};
        for (const [key,max] of Object.entries(config.fields)) {
            const value=body[key];
            if (max===0) {
                if (typeof value!=='number' || !Number.isSafeInteger(value) || value<1) throw new BadRequestException('กรุณาเลือก '+key);
                values[key]=value;
            } else {
                if (typeof value!=='string' || !value.trim() || value.trim().length>max) throw new BadRequestException(key+' ต้องมีข้อมูลและไม่เกิน '+max+' ตัวอักษร');
                values[key]=value.trim();
            }
        }
        if (!['0','1'].includes(body.STATUS as string)) throw new BadRequestException('Invalid status');
        values.STATUS=body.STATUS as string;
        return values;
    }

    @Get(':kind')
    async list(@Param('kind') kind:string) {
        const config=this.config(kind);
        const sql=kind==='mapping' ? `SELECT m.*, l.LOCATION_NAME,c.CAUSE_NAME,p.PROBLEM_NAME,e.MAIN_CATEGORY,e.EVENT_TYPE,e.PRODUCTION_IMPACT
            FROM WORKLOAD.PILINE_MAPPING_MST m
            LEFT JOIN WORKLOAD.PILINE_LOCATION_MST l ON l.LOCATION_ID=m.LOCATION_ID
            LEFT JOIN WORKLOAD.PILINE_CAUSE_MST c ON c.CAUSE_ID=m.CAUSE_ID
            LEFT JOIN WORKLOAD.PILINE_PROBLEM_MST p ON p.PROBLEM_ID=m.PROBLEM_ID
            LEFT JOIN WORKLOAD.PILINE_EVENT_MST e ON e.EVENT_ID=m.EVENT_ID
            ORDER BY l.LOCATION_NAME,c.CAUSE_NAME,p.PROBLEM_NAME,m.MAP_ID` :
            `SELECT * FROM WORKLOAD.${config.table} ORDER BY ${Object.keys(config.fields)[0]},${config.key}`;
        return {status:true,data:await this.db.query(sql)};
    }

    @Post(':kind')
    create(@Param('kind') kind:string,@Body() body:Record<string,unknown>) { return this.write(kind,body); }

    @Patch(':kind/:id')
    update(@Param('kind') kind:string,@Param('id',ParseIntPipe) id:number,@Body() body:Record<string,unknown>) { return this.write(kind,body,id); }

    private async write(kind:string,body:Record<string,unknown>,id?:number) {
        const config=this.config(kind), values=this.values(kind,body);
        try {
            return await this.db.transaction(async manager=>{
                // Serialize allocation and duplicate checks without introducing a schema/sequence change.
                await manager.query(`LOCK TABLE WORKLOAD.${config.table} IN EXCLUSIVE MODE NOWAIT`);
                if (id!==undefined && !(await manager.query(`SELECT ${config.key} FROM WORKLOAD.${config.table} WHERE ${config.key}=:1`,[id])).length) throw new NotFoundException('ไม่พบรายการ');
                const duplicate=await manager.query(`SELECT ${config.key} FROM WORKLOAD.${config.table} WHERE ${config.unique.map((key,i)=>`${key}=:${i+1}`).join(' AND ')}${id!==undefined?` AND ${config.key}<>:${config.unique.length+1}`:''}`,
                    [...config.unique.map(key=>values[key]),...(id!==undefined?[id]:[])]);
                if (duplicate.length) throw new ConflictException(kind==='mapping'?'มี Mapping ตำแหน่ง / สาเหตุ / ปัญหา นี้แล้ว':'มีข้อมูลนี้แล้ว');
                if (kind==='mapping') {
                    for (const target of ['location','cause','problem','event']) {
                        const ref=this.config(target);
                        if (!(await manager.query(`SELECT ${ref.key} FROM WORKLOAD.${ref.table} WHERE ${ref.key}=:1`,[values[ref.key]])).length) throw new BadRequestException('ไม่พบ master '+target);
                    }
                }
                const fields=Object.keys(values), params=Object.values(values);
                if (id===undefined) {
                    const rows=await manager.query(`SELECT NVL(MAX(${config.key}),0)+1 AS NEXT_ID FROM WORKLOAD.${config.table}`);
                    id=Number(rows[0].NEXT_ID);
                    await manager.query(`INSERT INTO WORKLOAD.${config.table} (${config.key},${fields.join(',')}) VALUES (${[id,...params].map((_,i)=>':'+(i+1)).join(',')})`,[id,...params]);
                } else {
                    await manager.query(`UPDATE WORKLOAD.${config.table} SET ${fields.map((key,i)=>`${key}=:${i+1}`).join(',')} WHERE ${config.key}=:${fields.length+1}`,[...params,id]);
                }
                return {status:true,data:{[config.key]:id}};
            });
        } catch(error) { this.databaseError(error); }
    }

    @Delete(':kind/:id')
    async remove(@Param('kind') kind:string,@Param('id',ParseIntPipe) id:number) {
        const config=this.config(kind);
        try {
            return await this.db.transaction(async manager=>{
                const row=await manager.query(`SELECT ${config.key} FROM WORKLOAD.${config.table} WHERE ${config.key}=:1 FOR UPDATE NOWAIT`,[id]);
                if (!row.length) throw new NotFoundException('ไม่พบรายการ');
                const references=[];
                if (['location','cause','problem','event'].includes(kind)) references.push('PILINE_MAPPING_MST');
                if (['location','cause','problem','initial'].includes(kind)) references.push('PILINE_EVENT_RECORD');
                for (const table of references) {
                    if ((await manager.query(`SELECT 1 FROM WORKLOAD.${table} WHERE ${config.key}=:1 AND ROWNUM=1`,[id])).length)
                        throw new ConflictException('ข้อมูลนี้ถูกใช้งานอยู่ กรุณาเปลี่ยนสถานะเป็น Inactive แทน');
                }
                await manager.query(`DELETE FROM WORKLOAD.${config.table} WHERE ${config.key}=:1`,[id]);
                return {status:true};
            });
        } catch(error) { this.databaseError(error); }
    }

    private databaseError(error:any):never {
        const code=error.driverError?.errorNum ?? error.errorNum;
        if (code===1) throw new ConflictException('มีข้อมูลซ้ำ กรุณาโหลดข้อมูลใหม่');
        if (code===54) throw new ConflictException('มีผู้ใช้อื่นกำลังแก้ไข กรุณาลองใหม่');
        if (code===2292) throw new ConflictException('ข้อมูลนี้ถูกใช้งานอยู่ ไม่สามารถลบได้');
        if (code===2291) throw new BadRequestException('ไม่พบ master ที่เลือก กรุณาโหลดข้อมูลใหม่');
        throw error;
    }
}
