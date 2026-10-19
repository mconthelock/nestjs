import { BadRequestException, Body, Controller, Injectable, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersService } from 'src/amec/users/users.service';
import { ConectionService } from 'src/as400/conection/conection.service';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { RNFRM } from 'src/common/Entities/webform/table/RNFRM.entity';
import { PilineEventRecordRepository } from './PILINE_EVENT_RECORD.repository';
import { PilineRejectDetailsService, PilineRejectDetails } from './PILINE_REJECT_DETAILS.service';
import { PilineRejectFlowService } from './PILINE_REJECT_FLOW.service';
import { PilineRejectRequestDto, SavePilineRejectDto } from './PILINE_REJECT_REQUEST.dto';

@Injectable()
export class PilineRejectRequestService {
    constructor(@InjectDataSource('webformConnection') private readonly db: DataSource,
        private readonly users: UsersService, private readonly as400: ConectionService,
        private readonly records: PilineEventRecordRepository,
        private readonly details: PilineRejectDetailsService, private readonly flows: PilineRejectFlowService) {}

    async prepare(dto: PilineRejectRequestDto) {
        if (!dto.PRONG.trim() || !dto.EXPLAIN.trim()) throw new BadRequestException('กรุณากรอก Process NG และอธิบายปัญหา');
        if ([1,2].includes(dto.WID) && !dto.NEED_NEW_PART) throw new BadRequestException('กรุณาเลือกต้องการ/ไม่ต้องการ Part ใหม่');
        if (new Set(dto.PARTS.map(p=>p.PILINE_NO)).size !== dto.PARTS.length) throw new BadRequestException('มีรายการ PI Line ซ้ำ');
        const [requester,inputer] = await Promise.all([this.users.findEmp(dto.REQUESTER),this.users.findEmp(dto.INPUTBY)]);
        if (!requester || !inputer) throw new BadRequestException('ไม่พบผู้ใช้งาน');
        const sections = await this.db.query(`SELECT S.SEC, S.SECCODE FROM WEBFORM.WTYPE_SECPIC W
            JOIN WEBFORM.SECPIC S ON W.SECID=S.SECID WHERE W.TID=:1 AND S.SECCODE=:2`,[dto.TID,dto.SECCODE]);
        const cause = await this.db.query('SELECT CID FROM WEBFORM.RNCAUSE WHERE CID=:1',[dto.CID]);
        if (!sections.length || !cause.length) throw new BadRequestException('ประเภทงาน แผนกรับผิดชอบ หรือสาเหตุไม่ถูกต้อง');
        const allSections = await this.db.query("SELECT SSECCODE, SSEC FROM AMEC.PSECTION WHERE UPPER(SSEC) NOT LIKE '%(CANCEL)%' AND SSECCODE <> '00' ORDER BY SSEC");
        const related = dto.RELATED.map(code=>allSections.find(row=>String(row.SSECCODE).trim()===code));
        if (related.some(row=>!row)) throw new BadRequestException('แผนกที่เกี่ยวข้องไม่ถูกต้อง');
        const source = (await this.records.findAll(true)).data;
        const parts: PilineRejectDetails['parts'] = [];
        for (const selected of dto.PARTS) {
            const record = source.find(row=>row.PILINE_NO===selected.PILINE_NO);
            if (!record?.ORDER_NO || !record.DRAWING) throw new BadRequestException(`รายการ ${selected.PILINE_NO} ไม่ใช่ NG/ACTIVE หรือไม่มี Order/Drawing`);
            const rows = await this.as400.runQuery(`SELECT DISTINCT Q9PRJ AS PROJ, Q41K02 AS PROD, Q41K03 AS ITEM, Q41K10 AS PART, Q9TYP AS MODEL
                FROM RTNLIBF.Q90010P2 INNER JOIN RTNLIBF.Q141KP ON Q9ORD=Q41K01
                WHERE Q41K01=? AND REPLACE(Q41K08,' ','')=?`,[record.ORDER_NO,record.DRAWING.replace(/\s/g,'')]);
            const normalize = (v: unknown) => String(v ?? '').trim();
            const matched = rows.filter(row=>normalize(row.PROD)===normalize(record.JUN) && normalize(row.ITEM)===normalize(record.ITEM));
            const choices = matched.length ? matched : rows;
            if (choices.length !== 1) throw new BadRequestException(`รายละเอียดชิ้นงาน ${selected.PILINE_NO} ไม่พบหรือไม่ชัดเจน`);
            if (selected.REFNO) {
                const match = /^(CN|PT|RQ)(\d{2})-(\d{6})$/.exec(selected.REFNO);
                if (!match) throw new BadRequestException('เลขอ้างอิงไม่ถูกต้อง');
                const table = {CN:'CNFORM',PT:'PTFORM',RQ:'RQFFRM'}[match[1]];
                const found = await this.db.query(`SELECT COUNT(*) AS TOTAL FROM WEBFORM.${table} WHERE CYEAR2=:1 AND NRUNNO=:2`,['20'+match[2],Number(match[3])]);
                if (!Number(found[0]?.TOTAL)) throw new BadRequestException(`ไม่พบเลข ${selected.REFNO}`);
            }
            const part = choices[0];
            parts.push({ORDERNO:record.ORDER_NO,DWGNO:record.DRAWING,PROJNO:normalize(part.PROJ),PROD:normalize(part.PROD),ITEM:normalize(part.ITEM),PART:normalize(part.PART),MODEL:normalize(part.MODEL),QTY:selected.QTY,REFNO:selected.REFNO});
        }
        const details: PilineRejectDetails = {TID:dto.TID,SECCODE:dto.SECCODE,CID:dto.CID,WID:dto.WID,PRONG:dto.PRONG.trim(),EXPLAIN:dto.EXPLAIN.trim(),
            relatedSectionNames:related.map(row=>String(row.SSEC).trim()),urgent:dto.URGENT,parts};
        const flow = await this.flows.plan(requester,dto.SECCODE,dto.TID,dto.WID);
        return {details,flow};
    }

    async save(dto: SavePilineRejectDto) {
        if (!dto.KEY || !dto.REQUEST) throw new BadRequestException('KEY and REQUEST are required');
        // No writes until master, references, source parts and approvers have been checked.
        // A committed retry already moved the source rows out of ACTIVE.
        const prepared = await this.db.getRepository(RNFRM).existsBy(dto.KEY) ? null : await this.prepare(dto.REQUEST);
        return this.db.transaction(manager=>transactionContext.run({manager},async()=>{
            const k = dto.KEY;
            const forms = await manager.query('SELECT VREQNO,VINPUTER FROM WEBFORM.FORM WHERE NFRMNO=:1 AND VORGNO=:2 AND CYEAR=:3 AND CYEAR2=:4 AND NRUNNO=:5 FOR UPDATE NOWAIT',
                [k.NFRMNO,k.VORGNO,k.CYEAR,k.CYEAR2,k.NRUNNO]);
            if (!forms.length || forms[0].VREQNO?.trim()!==dto.REQUEST.REQUESTER || forms[0].VINPUTER?.trim()!==dto.REQUEST.INPUTBY) throw new BadRequestException('เลขฟอร์มไม่ตรงกับผู้ร้องขอ/ผู้บันทึก');
            const existing = await manager.getRepository(RNFRM).findOneBy(k);
            if (existing) return {status:true,data:{...k,REJECTPRE:existing.REJECTPRE,REJECTNO:existing.REJECTNO},alreadySaved:true};
            if (!prepared) throw new BadRequestException('ไม่พบรายละเอียดฟอร์ม กรุณาลองใหม่');
            // Lock only selected events; another request must not reject the same events twice.
            const selected = [...new Set(dto.REQUEST.PARTS.map(part=>part.PILINE_NO))].sort();
            for (const number of selected) {
                const rows = await manager.query('SELECT IS_NG, RECORD_STATUS FROM WORKLOAD.PILINE_EVENT_RECORD WHERE PILINE_NO=:1 FOR UPDATE NOWAIT',[number]);
                if (rows.length !== 1 || String(rows[0].IS_NG).trim() !== '1' || rows[0].RECORD_STATUS !== 'ACTIVE') {
                    throw new BadRequestException('รายการ ' + number + ' ไม่ใช่ NG/ACTIVE แล้ว กรุณาโหลดรายการใหม่');
                }
            }
            const reject = await this.details.insert(manager,k,prepared.details);
            await this.flows.apply(k,prepared.flow);
            // Same Oracle transaction: RN + Flow + source status commit or roll back together.
            for (const number of selected) {
                await manager.query("UPDATE WORKLOAD.PILINE_EVENT_RECORD SET RECORD_STATUS='QC_REJECT', REF_RN_CYEAR2=:1, REF_RN_NRUNNO=:2 WHERE PILINE_NO=:3",[k.CYEAR2,k.NRUNNO,number]);
            }
            return {status:true,data:{...k,...reject}};
        }));
    }
}

@Controller('workload/piline_issue/request')
@UsePipes(new ValidationPipe({transform:true,whitelist:true,forbidNonWhitelisted:true}))
export class PilineRejectRequestController {
    constructor(private readonly service: PilineRejectRequestService) {}
    @Post('prepare')
    async prepare(@Body() body: PilineRejectRequestDto) {
        await this.service.prepare(body);
        return {status:true};
    }
    @Post()
    save(@Body() body: SavePilineRejectDto) { return this.service.save(body); }
}


