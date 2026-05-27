import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource, } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager  } from 'typeorm';

import { CreateMfgEdrDto } from './dto/create-mfg-edr.dto';
import { SearchCauseDto } from './dto/search-cause.dto';
import { GetMfgEdrDto } from './dto/get-mfg-edr.dto';

import { EdrWorktypeMst } from '../../../common/Entities/webform/table/edr_worktype_mst.entity';
import { EdrCauseMst } from '../../../common/Entities/webform/table/edr_cause_mst.entity';
import { EdrLineMst } from '../../../common/Entities/webform/table/edr_line_mst.entity';
import { EdrProcessMst } from '../../../common/Entities/webform/table/edr_process_mst.entity';

import { MfgEdrFormHead } from '../../../common/Entities/webform/table/mfg_edr_form_head.entity';
import { MfgEdrFormList } from '../../../common/Entities/webform/table/mfg_edr_form_list.entity';
import { MfgEdrFormAtt } from '../../../common/Entities/webform/table/mfg_edr_form_att.entity';
import { MfgEdrFormCause4m } from '../../../common/Entities/webform/table/mfg_edr_form_cause4m.entity';

import { AmecOrders } from 'src/common/Entities/workload/table/amecorders.entity';
import { AmecOrdersSchedule } from 'src/common/Entities/workload/table/amecorders_schedule.entity';
import { FORM } from '../../../common/Entities/webform/table/FORM.entity';
import { FLOW } from '../../../common/Entities/webform/table/FLOW.entity';
import { AMECUSERALL } from '../../../common/Entities/amec/views/AMECUSERALL.entity';

type FormKey = Pick<CreateMfgEdrDto, 'NFRMNO' | 'VORGNO' | 'CYEAR' | 'CYEAR2' | 'NRUNNO'>;

@Injectable()
export class MfgEdrService {
  constructor(
    @InjectRepository(EdrWorktypeMst, 'webformConnection')
    private readonly worktypeRepo: Repository<EdrWorktypeMst>,

    @InjectRepository(EdrCauseMst, 'webformConnection')
    private readonly causeRepo: Repository<EdrCauseMst>,

    @InjectRepository(EdrProcessMst, 'webformConnection')
    private readonly processRepo: Repository<EdrProcessMst>,

    @InjectRepository(EdrLineMst, 'webformConnection')
    private readonly lineRepo: Repository<EdrLineMst>,

    @InjectRepository(AmecOrders, 'webformConnection')
    private readonly amecOrdersRepo: Repository<AmecOrders>,

    @InjectRepository(AmecOrdersSchedule, 'webformConnection')
    private readonly amecOrdersScheduleRepo: Repository<AmecOrdersSchedule>,

    @InjectRepository(MfgEdrFormHead, 'webformConnection')
    private readonly formHeadRepo: Repository<MfgEdrFormHead>,

    @InjectRepository(MfgEdrFormList, 'webformConnection')
    private readonly formListRepo: Repository<MfgEdrFormList>,

    @InjectRepository(MfgEdrFormAtt, 'webformConnection')
    private readonly formAttRepo: Repository<MfgEdrFormAtt>,

    @InjectRepository(MfgEdrFormCause4m, 'webformConnection')
    private readonly formCause4mRepo: Repository<MfgEdrFormCause4m>,

    @InjectRepository(FORM, 'webformConnection')
    private readonly formRepo: Repository<FORM>,

    @InjectRepository(FLOW, 'webformConnection')
    private readonly flowRepo: Repository<FLOW>,

    @InjectDataSource('webformConnection')
    private readonly dataSource: DataSource,
  ) {}


  findAll() {
    return `This action returns all mfgEdr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mfgEdr`;
  }

  remove(id: number) {
    return `This action removes a #${id} mfgEdr`;
  }

  async getCause(dto: SearchCauseDto) {
    const causeGroup = (dto as any).CAUSE_GROUP;
    if (!causeGroup) {throw new Error('CAUSE_GROUP is required');}
    return this.causeRepo
      .createQueryBuilder('cause')
      .where('cause.FOR_MFG = :forMfg', { forMfg: '1' })
      .andWhere('cause.CAUSE_GROUP = :causeGroup', { causeGroup })
      .orderBy('cause.CID', 'ASC')
      .getMany();
  }

  async getWorktype() {
    return this.worktypeRepo.find({
      where: { FOR_MFG: '1',},
      order: { TID: 'ASC',},
    });
  }

  async getProcess() {
    return this.processRepo.find({
      order: { PID: 'ASC',},
    });
  }

  async getLine() {
    return this.lineRepo.find({
      order: { LID: 'ASC',},
    });
  }

  async getOrderDetail(order: string) {
    if (!order) {
      throw new Error('MFGNO is required');
    }

    return this.amecOrdersRepo
      .createQueryBuilder('A')
      .select([
        'A.PRJ_NO AS PRJ_NO',
        'A.SERIES AS MODEL',
        'B.MFGBM AS PROD',
      ])
      .leftJoin(
        AmecOrdersSchedule,
        'B',
        'A.MFGNO = B.REFMFGNO'
      )
      .where('UPPER(A.MFGNO) = :order', {
        order: order.toUpperCase(),
      })
      .getRawOne();
  }

  async create(dto: CreateMfgEdrDto) {
    console.log('CREATE MFG EDR DTO:', dto);
    return this.dataSource.transaction(async (manager) => {
      const key = this.getFormKey(dto);
      const REQBY = String((dto as any).REQBY || '').trim();

      if (!REQBY) throw new Error('REQBY is required');

      const requester = await this.getRequesterInfo(manager, REQBY);
      if (!requester.SSECCODE) throw new Error('Requester SSECCODE not found');

      dto.SSECCODE = requester.SSECCODE;
      dto.SDEPCODE = requester.SDEPCODE;

      await this.insertFormHead(manager, key, dto);
      await this.syncApproveFlow(manager, key, dto);

      const listCount = await this.insertFormList(manager, key, dto.list ?? []);
      const attCount = await this.insertFormAtt(manager, key, dto.att ?? []);

      return {
        status: true,
        message: 'Create MFG EDR form success',
        data: {
          key,
          list_count: listCount,
          att_count: attCount,
        },
      };
    });
  }

  private getFormKey(dto: CreateMfgEdrDto): FormKey {
    return {
      NFRMNO: Number(dto.NFRMNO),
      VORGNO: String(dto.VORGNO),
      CYEAR: String(dto.CYEAR),
      CYEAR2: String(dto.CYEAR2),
      NRUNNO: Number(dto.NRUNNO),
    };
  }


  private async syncApproveFlow(
    manager: EntityManager,
    key: FormKey,
    dto: CreateMfgEdrDto,
  ) {
    const flowKey = this.getFormKey(key as CreateMfgEdrDto);

    const SSECCODE = String(dto.SSECCODE || '').trim();
    const SDEPCODE = String((dto as any).SDEPCODE || '').trim();

    if (!SSECCODE) throw new Error('Requester SSECCODE not found');

    const step61 = await this.findFlowStep(manager, flowKey, '61');
    const step18 = await this.findFlowStep(manager, flowKey, '18');

    if (!step61 && !step18) return;

    const emp61 = step61 && SDEPCODE ? await this.findApprover(manager, 'SDEPCODE', SDEPCODE, '35') : '';
    const emp18 = step18 ? await this.findApprover(manager, 'SSECCODE', SSECCODE, '33'): '';

    if (emp61) await this.updateApprover(manager, flowKey, '61', emp61);
    if (emp18) await this.updateApprover(manager, flowKey, '18', emp18);

    if (emp61 && emp18) return;

    if (step61 && !emp61) {
      await this.bypassStep(manager, flowKey, '61', emp18 ? '18' : String(step18?.CSTEPNEXTNO || '').trim());
      await this.deleteFlowStep(manager, flowKey, '61');
    }

    if (step18 && !emp18) {
      if (emp61) {
        await this.updateStepNext(manager, flowKey, '61', String(step18.CSTEPNEXTNO || '').trim());
      } else {
        await this.bypassStep(manager, flowKey, '18', String(step18.CSTEPNEXTNO || '').trim());
      }

      await this.deleteFlowStep(manager, flowKey, '18');
    }
  }

  private async findFlowStep(
    manager: EntityManager,
    flowKey: FormKey,
    stepNo: string,
  ) {
    return manager
      .createQueryBuilder(FLOW, 'F')
      .select(['F.CSTEPNO AS CSTEPNO', 'F.CSTEPNEXTNO AS CSTEPNEXTNO'])
      .where('F.NFRMNO = :NFRMNO', flowKey)
      .andWhere('F.VORGNO = :VORGNO', flowKey)
      .andWhere('F.CYEAR = :CYEAR', flowKey)
      .andWhere('F.CYEAR2 = :CYEAR2', flowKey)
      .andWhere('F.NRUNNO = :NRUNNO', flowKey)
      .andWhere('TO_CHAR(F.CSTEPNO) = :stepNo', { stepNo })
      .getRawOne();
  }

  private async findApprover(
    manager: EntityManager,
    field: 'SSECCODE' | 'SDEPCODE',
    code: string,
    posCode: string,
  ) {
    const row = await manager
      .createQueryBuilder(AMECUSERALL, 'U')
      .select('TRIM(U.SEMPNO)', 'SEMPNO')
      .where(`TRIM(U.${field}) = :code`, { code })
      .andWhere('TO_CHAR(U.SPOSCODE) = :posCode', { posCode })
      .andWhere("TO_CHAR(U.CSTATUS) = '1'")
      .getRawOne();

    return String(row?.SEMPNO || '').trim();
  }

  private async updateApprover(
    manager: EntityManager,
    flowKey: FormKey,
    stepNo: string,
    empno: string,
  ) {
    return manager
      .createQueryBuilder()
      .update(FLOW)
      .set({ VAPVNO: empno, VREPNO: empno } as any)
      .where('NFRMNO = :NFRMNO', flowKey)
      .andWhere('VORGNO = :VORGNO', flowKey)
      .andWhere('CYEAR = :CYEAR', flowKey)
      .andWhere('CYEAR2 = :CYEAR2', flowKey)
      .andWhere('NRUNNO = :NRUNNO', flowKey)
      .andWhere('TO_CHAR(CSTEPNO) = :stepNo', { stepNo })
      .execute();
  }

  private async updateStepNext(
    manager: EntityManager,
    flowKey: FormKey,
    stepNo: string,
    nextStepNo: string,
  ) {
    if (!nextStepNo) throw new Error(`Next step of step ${stepNo} not found`);

    return manager
      .createQueryBuilder()
      .update(FLOW)
      .set({ CSTEPNEXTNO: nextStepNo } as any)
      .where('NFRMNO = :NFRMNO', flowKey)
      .andWhere('VORGNO = :VORGNO', flowKey)
      .andWhere('CYEAR = :CYEAR', flowKey)
      .andWhere('CYEAR2 = :CYEAR2', flowKey)
      .andWhere('NRUNNO = :NRUNNO', flowKey)
      .andWhere('TO_CHAR(CSTEPNO) = :stepNo', { stepNo })
      .execute();
  }

  private async bypassStep(
    manager: EntityManager,
    flowKey: FormKey,
    oldStepNo: string,
    newStepNo: string,
  ) {
    if (!newStepNo) throw new Error(`Next step of step ${oldStepNo} not found`);
    return manager
      .createQueryBuilder()
      .update(FLOW)
      .set({ CSTEPNEXTNO: newStepNo } as any)
      .where('NFRMNO = :NFRMNO', flowKey)
      .andWhere('VORGNO = :VORGNO', flowKey)
      .andWhere('CYEAR = :CYEAR', flowKey)
      .andWhere('CYEAR2 = :CYEAR2', flowKey)
      .andWhere('NRUNNO = :NRUNNO', flowKey)
      .andWhere('TO_CHAR(CSTEPNEXTNO) = :oldStepNo', { oldStepNo })
      .execute();
  }

  private async deleteFlowStep(
    manager: EntityManager,
    flowKey: FormKey,
    stepNo: string,
  ) {
    return manager
      .createQueryBuilder()
      .delete()
      .from(FLOW)
      .where('NFRMNO = :NFRMNO', flowKey)
      .andWhere('VORGNO = :VORGNO', flowKey)
      .andWhere('CYEAR = :CYEAR', flowKey)
      .andWhere('CYEAR2 = :CYEAR2', flowKey)
      .andWhere('NRUNNO = :NRUNNO', flowKey)
      .andWhere('TO_CHAR(CSTEPNO) = :stepNo', { stepNo })
      .execute();
  }
/*
 private async syncApproveFlowStep18(
  manager: EntityManager,
  key: FormKey,
  dto: CreateMfgEdrDto,
) {
  const SSECCODE = String(dto.SSECCODE || '').trim();
  if (!SSECCODE) throw new Error('Requester SSECCODE not found');

  const flowKey = {
    NFRMNO: Number(key.NFRMNO),
    VORGNO: String(key.VORGNO),
    CYEAR: String(key.CYEAR),
    CYEAR2: String(key.CYEAR2),
    NRUNNO: Number(key.NRUNNO),
  };

  const step18 = await manager
    .createQueryBuilder(FLOW, 'F')
    .select([
      'F.CSTEPNO AS CSTEPNO',
      'F.CSTEPNEXTNO AS CSTEPNEXTNO',
    ])
    .where('F.NFRMNO = :NFRMNO', flowKey)
    .andWhere('F.VORGNO = :VORGNO', flowKey)
    .andWhere('F.CYEAR = :CYEAR', flowKey)
    .andWhere('F.CYEAR2 = :CYEAR2', flowKey)
    .andWhere('F.NRUNNO = :NRUNNO', flowKey)
    .andWhere("TO_CHAR(F.CSTEPNO) = :CSTEPNO", { CSTEPNO: '18' })
    .getRawOne();

  if (!step18) return;

  const approveUser = await manager
    .createQueryBuilder(AMECUSERALL, 'U')
    .select('TRIM(U.SEMPNO)', 'SEMPNO')
    .where('TRIM(U.SSECCODE) = :SSECCODE', { SSECCODE })
    .andWhere("TO_CHAR(U.SPOSCODE) = :SPOSCODE", { SPOSCODE: '33' })
    .andWhere("TO_CHAR(U.CSTATUS) = :CSTATUS", { CSTATUS: '1' })
    .getRawOne();

  if (approveUser?.SEMPNO) {
    await manager
      .createQueryBuilder()
      .update(FLOW)
      .set({
        VAPVNO: approveUser.SEMPNO,
        VREPNO: approveUser.SEMPNO,
      } as any)
      .where('NFRMNO = :NFRMNO', flowKey)
      .andWhere('VORGNO = :VORGNO', flowKey)
      .andWhere('CYEAR = :CYEAR', flowKey)
      .andWhere('CYEAR2 = :CYEAR2', flowKey)
      .andWhere('NRUNNO = :NRUNNO', flowKey)
      .andWhere("TO_CHAR(CSTEPNO) = :CSTEPNO", { CSTEPNO: '18' })
      .execute();

    return;
  }

  const nextStepNo = String(step18.CSTEPNEXTNO || '').trim();
  await manager
    .createQueryBuilder()
    .update(FLOW)
    .set({
      CSTEPNEXTNO: nextStepNo,
    } as any)
    .where('NFRMNO = :NFRMNO', flowKey)
    .andWhere('VORGNO = :VORGNO', flowKey)
    .andWhere('CYEAR = :CYEAR', flowKey)
    .andWhere('CYEAR2 = :CYEAR2', flowKey)
    .andWhere('NRUNNO = :NRUNNO', flowKey)
    .andWhere("TO_CHAR(CSTEPNEXTNO) = :OLDSTEP", { OLDSTEP: '18' })
    .execute();

  await manager
    .createQueryBuilder()
    .delete()
    .from(FLOW)
    .where('NFRMNO = :NFRMNO', flowKey)
    .andWhere('VORGNO = :VORGNO', flowKey)
    .andWhere('CYEAR = :CYEAR', flowKey)
    .andWhere('CYEAR2 = :CYEAR2', flowKey)
    .andWhere('NRUNNO = :NRUNNO', flowKey)
    .andWhere("TO_CHAR(CSTEPNO) = :CSTEPNO", { CSTEPNO: '18' })
    .execute();
}
*/

  private async getRequesterInfo(
      manager: EntityManager,
    reqby: string,
  ) {
    const requester = await manager
      .createQueryBuilder(AMECUSERALL, 'R')
      .select([
        'TRIM(R.SSECCODE) AS SSECCODE',
        'TRIM(R.SDEPCODE) AS SDEPCODE',
      ])
      .where('TRIM(R.SEMPNO) = :REQBY', { REQBY: reqby })
      .andWhere("TO_CHAR(R.CSTATUS) = :CSTATUS", { CSTATUS: '1' })
      .getRawOne();

    return {
      SSECCODE: String(requester?.SSECCODE || '').trim(),
      SDEPCODE: String(requester?.SDEPCODE || '').trim(),
    };
  }

  private async insertFormHead(
    manager: EntityManager,
    key: FormKey,
    dto: CreateMfgEdrDto,
  ) {
    const exists = await manager.exists(MfgEdrFormHead, { where: key });
    if (exists) throw new Error('MFG EDR form already exists');

    const {
      TID = null,
      SSECCODE = dto.SSECCODE ? String(dto.SSECCODE).trim() : null,
      CID = null,
      REPAIR_BY = null,
      REASON_CAUSE = null,
    } = dto;



    const DAILY_MONTH = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const lastRun = await manager
      .createQueryBuilder(MfgEdrFormHead, 'H')
      .select('MAX(H.DAILY_RUNNO)', 'DAILY_RUNNO')
      .where('H.CYEAR2 = :CYEAR2', { CYEAR2: key.CYEAR2 })
      .andWhere('H.DAILY_MONTH = :DAILY_MONTH', { DAILY_MONTH })
      .andWhere('H.SSECCODE = :SSECCODE', { SSECCODE })
      .getRawOne();
    const DAILY_RUNNO = Number(lastRun?.DAILY_RUNNO || 0) + 1;

    return manager.save(
      MfgEdrFormHead,
      manager.create(MfgEdrFormHead, {
        ...key,
        TID,
        SSECCODE,
        CID,
        REPAIR_BY,
        DAILY_MONTH,
        DAILY_RUNNO,
        REASON_CAUSE,
      }),
    );
  }

  private async insertFormList(
    manager: EntityManager,
    key: FormKey,
    list: CreateMfgEdrDto['list'] = [],
  ) {
    if (!list.length) return 0;

    const rows = list.map((row, i) =>
      manager.create(MfgEdrFormList, {
        ...key,
        ID: i + 1,
        ...row,
      }),
    );

    await manager.save(MfgEdrFormList, rows);
    return rows.length;
  }

  private async insertFormAtt(
    manager: EntityManager,
    key: FormKey,
    att: CreateMfgEdrDto['att'] = [],
  ) {
    const rows = att
      .filter((row) => row.FILENAME)
      .map((row, i) =>
        manager.create(MfgEdrFormAtt, {
          ...key,
          ID: i + 1,
          ...row,
        }),
      );

    if (!rows.length) return 0;

    await manager.save(MfgEdrFormAtt, rows);
    return rows.length;
  }

  private async replaceFormList(manager: EntityManager, key: FormKey, list: CreateMfgEdrDto['list'] = []) {
    await manager.delete(MfgEdrFormList, key);
    return this.insertFormList(manager, key, list);
  }

  private async replaceFormAtt(manager: EntityManager, key: FormKey, att: CreateMfgEdrDto['att'] = []) {
    await manager.delete(MfgEdrFormAtt, key);
    return this.insertFormAtt(manager, key, att);
  }

  async updateDetail(dto: CreateMfgEdrDto) {
    return this.dataSource.transaction(async (manager) => {
      const key = this.getFormKey(dto);

      const head = await manager.findOne(MfgEdrFormHead, {
        where: key,
      });

      if (!head) {
        throw new Error('MFG EDR form head not found');
      }

      const listCount = await this.replaceFormList(manager, key, dto.list ?? []);
      const attCount = await this.replaceFormAtt(manager, key, dto.att ?? []);

      return {
        status: true,
        message: 'Update MFG EDR detail success',
        data: {
          key,
          list_count: listCount,
          att_count: attCount,
        },
      };
    });
  }

  async getMfgEdr(dto: GetMfgEdrDto) {
    console.log('RAW DTO =', dto);
    console.log('KEYS =', Object.keys(dto || {}));

    const key = {
      NFRMNO: Number(dto.NFRMNO),
      VORGNO: dto.VORGNO,
      CYEAR: dto.CYEAR,
      CYEAR2: dto.CYEAR2,
      NRUNNO: Number(dto.NRUNNO),
    };

    console.log('KEY =', key);
    
    const form = await this.formRepo
      .createQueryBuilder('A')
      .leftJoin(AMECUSERALL,'B', 'A.VREQNO = B.SEMPNO', )
      .leftJoin( AMECUSERALL,'C','A.VINPUTER = C.SEMPNO',)
      .select([
        'A.*',
        'B.SEMPNO AS REQ_EMPNO',
        'B.SNAME AS REQ_NAME',
        'B.SSEC AS REQ_SEC',
        'C.SEMPNO AS INP_EMPNO',
        'C.SNAME AS INP_NAME',
      ])
      .where('A.NFRMNO = :NFRMNO', key)
      .andWhere('A.VORGNO = :VORGNO', key)
      .andWhere('A.CYEAR = :CYEAR', key)
      .andWhere('A.CYEAR2 = :CYEAR2', key)
      .andWhere('A.NRUNNO = :NRUNNO', key)
      .getRawOne();

    const flow = await this.flowRepo
      .createQueryBuilder('F')
      .where('F.NFRMNO = :NFRMNO', key)
      .andWhere('F.VORGNO = :VORGNO', key)
      .andWhere('F.CYEAR = :CYEAR', key)
      .andWhere('F.CYEAR2 = :CYEAR2', key)
      .andWhere('F.NRUNNO = :NRUNNO', key)
      .orderBy('F.CSTEPNO', 'ASC')
      .getMany();

    const head = await this.formHeadRepo
      .createQueryBuilder('H')
      .leftJoin(EdrWorktypeMst,'WT','WT.TID = H.TID',)
      .leftJoin(EdrCauseMst,'C','C.CID = H.CID',)
      .leftJoin(AMECUSERALL,'D', 'H.REPAIR_BY = D.SEMPNO', )
      .select([
        'H.NFRMNO AS NFRMNO',
        'H.VORGNO AS VORGNO',
        'H.CYEAR AS CYEAR',
        'H.CYEAR2 AS CYEAR2',
        'H.NRUNNO AS NRUNNO',
        'H.TID AS TID',
        'WT.TYPENAME AS TYPENAME',
        'H.CID AS CID',
        'C.CAUSE AS CAUSE',
        'C.CAUSENAME AS CAUSENAME',
        'C.CAUSE_GROUP AS CAUSE_GROUP',
        'H.SSECCODE AS SSECCODE',
        'H.REPAIR_BY AS REPAIR_BY',
        'D.SNAME AS REPAIR_BY_NAME',
        'H.DAILY_MONTH AS DAILY_MONTH',
        'H.DAILY_RUNNO AS DAILY_RUNNO',
        'H.REASON_CAUSE AS REASON_CAUSE',
      ])

      .where('H.NFRMNO = :NFRMNO', key)
      .andWhere('H.VORGNO = :VORGNO', key)
      .andWhere('H.CYEAR = :CYEAR', key)
      .andWhere('H.CYEAR2 = :CYEAR2', key)
      .andWhere('H.NRUNNO = :NRUNNO', key)
      .getRawOne();

    const list = await this.formListRepo
      .createQueryBuilder('L')
      .leftJoin(EdrLineMst,'LM','LM.LID = L.LID',)
      .leftJoin(EdrProcessMst,'PM','PM.PID = L.PID',)
      .leftJoin(AmecOrders,'A','UPPER(A.MFGNO) = UPPER(L.ORDERNO)',)
      .leftJoin(AmecOrdersSchedule,'B','A.MFGNO = B.REFMFGNO',)
      .select([
        'L.*',
        'LM.LINE AS LINE',
        'PM.PROCESS AS PROCESS',
        'A.PRJ_NO AS PRJ_NO',
        'A.SERIES AS MODEL',
        'B.MFGBM AS PROD',
      ])

      .where('L.NFRMNO = :NFRMNO', key)
      .andWhere('L.VORGNO = :VORGNO', key)
      .andWhere('L.CYEAR = :CYEAR', key)
      .andWhere('L.CYEAR2 = :CYEAR2', key)
      .andWhere('L.NRUNNO = :NRUNNO', key)
      .orderBy('L.ID', 'ASC')
      .getRawMany();

    const att = await this.formAttRepo.find({
      where: key,
      order: { ID: 'ASC' },
    });

    const cause4m = await this.formCause4mRepo.find({
      where: key,
      order: { ID: 'ASC' },
    });


    return {
      status: true,
      data: {
        form,
        flow,
        head,
        list,
        att,
        cause4m,
      },
    };
  }


  async updateCause4M(dto: any) {
    const key = {
      NFRMNO: Number(dto.NFRMNO),
      VORGNO: String(dto.VORGNO),
      CYEAR: String(dto.CYEAR),
      CYEAR2: String(dto.CYEAR2),
      NRUNNO: Number(dto.NRUNNO),
    };

    return await this.dataSource.transaction(async (manager) => {
      await manager.delete(MfgEdrFormCause4m, key);
      if (Array.isArray(dto.CAUSE4M_LIST)) {
        const cause4mRows = dto.CAUSE4M_LIST
          .filter((row) => row.CAUSE)
          .map((row, index) =>
            manager.create(MfgEdrFormCause4m, {
              ...key,
              ID: index + 1,
              CAUSE: row.CAUSE,
              DETAIL: row.DETAIL,
              DUE_DATE: row.DUE_DATE || null,
              PIC: row.PIC || null,
            }),
          );

        if (cause4mRows.length) {
          await manager.save(MfgEdrFormCause4m, cause4mRows);
        }
      }

      return {
        status: true,
        message: 'Update Cause 4 M success',
      };
    });
  }
      


    
}