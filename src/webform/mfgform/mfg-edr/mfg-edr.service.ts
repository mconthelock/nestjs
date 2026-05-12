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
      console.log('FORM KEY:', key);

      await this.insertFormHead(manager, key, dto);
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

  private async insertFormHead(
    manager: EntityManager,
    key: FormKey,
    dto: CreateMfgEdrDto,
  ) {
    const exists = await manager.exists(MfgEdrFormHead, { where: key });
    if (exists) throw new Error('MFG EDR form already exists');

    const {
      TID = null,
      SSECCODE = null,
      CID = null,
      REPAIR_BY = null,
      DAILY_MONTH = null,
      DAILY_RUNNO = null,
      REASON_CAUSE = null,
    } = dto;

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
  const key = {
    NFRMNO: Number(dto.NFRMNO),
    VORGNO: String(dto.VORGNO),
    CYEAR: String(dto.CYEAR),
    CYEAR2: String(dto.CYEAR2),
    NRUNNO: Number(dto.NRUNNO),
  };

  const head = await this.formHeadRepo
    .createQueryBuilder('H')

    .leftJoin(
      EdrWorktypeMst,
      'WT',
      'WT.TID = H.TID',
    )

    .leftJoin(
      EdrCauseMst,
      'C',
      'C.CID = H.CID',
    )

    .select([
      'H.NFRMNO AS NFRMNO',
      'H.VORGNO AS VORGNO',
      'H.CYEAR AS CYEAR',
      'H.CYEAR2 AS CYEAR2',
      'H.NRUNNO AS NRUNNO',

      'H.TID AS TID',
      'WT.TYPENAME AS TYPENAME',
      'WT.TYPESTATUS AS TYPESTATUS',

      'H.CID AS CID',
      'C.CAUSE AS CAUSE',
      'C.CAUSENAME AS CAUSENAME',
      'C.CAUSE_GROUP AS CAUSE_GROUP',
      'C.CAUSESTATUS AS CAUSESTATUS',

      'H.SSECCODE AS SSECCODE',
      'H.REPAIR_BY AS REPAIR_BY',
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

    .leftJoin(
      EdrLineMst,
      'LM',
      'LM.LID = L.LID',
    )

    .leftJoin(
      EdrProcessMst,
      'PM',
      'PM.PID = L.PID',
    )

    .select([
      'L.*',

      'LM.LINE_NAME AS LINE_NAME',
      'LM.LINE_STATUS AS LINE_STATUS',

      'PM.PROCESS_NAME AS PROCESS_NAME',
      'PM.PROCESS_STATUS AS PROCESS_STATUS',
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
      head,
      list,
      att,
      corrective,
      preventive,
      why,
    },
  };
}
  


    
}