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
import { MfgEdrFormCorrective } from '../../../common/Entities/webform/table/mfg_edr_form_corrective.entity';
import { MfgEdrFormPreventive } from '../../../common/Entities/webform/table/mfg_edr_form_preventive.entity';
import { MfgEdrFormWhy } from '../../../common/Entities/webform/table/mfg_edr_form_why.entity';


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

    @InjectRepository(MfgEdrFormCorrective, 'webformConnection')
    private readonly formCorrectiveRepo: Repository<MfgEdrFormCorrective>,

    @InjectRepository(MfgEdrFormPreventive, 'webformConnection')
    private readonly formPreventiveRepo: Repository<MfgEdrFormPreventive>,

    @InjectRepository(MfgEdrFormWhy, 'webformConnection')
    private readonly formWhyRepo: Repository<MfgEdrFormWhy>,

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

      const requesterSseccode = await this.getRequesterSseccode(manager, REQBY);
      if (!requesterSseccode) throw new Error('Requester SSECCODE not found');

      dto.SSECCODE = requesterSseccode;

      await this.insertFormHead(manager, key, dto);
      await this.syncApproveFlowStep18(manager, key, dto);

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

  private async getRequesterSseccode(
    manager: EntityManager,
    reqby: string,
  ) {
    const requester = await manager
      .createQueryBuilder(AMECUSERALL, 'R')
      .select('TRIM(R.SSECCODE)', 'SSECCODE')
      .where('TRIM(R.SEMPNO) = :REQBY', { REQBY: reqby })
      .andWhere("TO_CHAR(R.CSTATUS) = :CSTATUS", { CSTATUS: '1' })
      .getRawOne();

    return String(requester?.SSECCODE || '').trim();
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

    const corrective = await this.formCorrectiveRepo.find({
      where: key,
      order: { ID: 'ASC' },
    });

    const preventive = await this.formPreventiveRepo.find({
      where: key,
      order: { ID: 'ASC' },
    });

    const why = await this.formWhyRepo.find({
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
        corrective,
        preventive,
        why,
      },
    };
  }


  async updateWhyEffect(dto: any) {
    const key = {
      NFRMNO: Number(dto.NFRMNO),
      VORGNO: String(dto.VORGNO),
      CYEAR: String(dto.CYEAR),
      CYEAR2: String(dto.CYEAR2),
      NRUNNO: Number(dto.NRUNNO),
    };

    return await this.dataSource.transaction(async (manager) => {
      if (Array.isArray(dto.DETAIL_LIST)) {
        for (const row of dto.DETAIL_LIST) {
          if (!row.ID) continue;

          await manager.update(
            MfgEdrFormList,
            {
              ...key,
              ID: Number(row.ID),
            },
            {
              LV_EFFECT: row.LV_EFFECT || null,
              EFFECT: row.EFFECT || null,
            },
          );
        }
      }

      await manager.delete(MfgEdrFormWhy, key);
      if (Array.isArray(dto.WHY_LIST)) {
        const whyRows = dto.WHY_LIST
          .filter((row) => row.WHY)
          .map((row, index) =>
            manager.create(MfgEdrFormWhy, {
              ...key,
              ID: index + 1,
              WHY: row.WHY,
            }),
          );

        if (whyRows.length) {
          await manager.save(MfgEdrFormWhy, whyRows);
        }
      }

      await manager.delete(MfgEdrFormCorrective, key);
      if (Array.isArray(dto.CORRECTIVE_LIST)) {
        const correctiveRows = dto.CORRECTIVE_LIST
          .filter((row) => row.CORRECTIVE)
          .map((row, index) =>
            manager.create(MfgEdrFormCorrective, {
              ...key,
              ID: index + 1,
              CORRECTIVE: row.CORRECTIVE,
              DUE_DATE: row.DUE_DATE || null,
              PIC: row.PIC || null,
            }),
          );

        if (correctiveRows.length) {
          await manager.save(MfgEdrFormCorrective, correctiveRows);
        }
      }

      await manager.delete(MfgEdrFormPreventive, key);

      if (Array.isArray(dto.PREVENTIVE_LIST)) {
        const preventiveRows = dto.PREVENTIVE_LIST
          .filter((row) => row.PREVENTIVE)
          .map((row, index) =>
            manager.create(MfgEdrFormPreventive, {
              ...key,
              ID: index + 1,
              PREVENTIVE: row.PREVENTIVE,
              DUE_DATE: row.DUE_DATE || null,
              PIC: row.PIC || null,
            }),
          );

        if (preventiveRows.length) {
          await manager.save(MfgEdrFormPreventive, preventiveRows);
        }
      }

      return {
        status: true,
        message: 'Update why/effect success',
      };
    });
  }
      


    
}