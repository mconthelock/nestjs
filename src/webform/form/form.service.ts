import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Form } from './entities/form.entity';
import { Flow } from './../flow/entities/flow.entity';

import { getFormnoDto } from 'src/webform/form/dto/get-formno.dto';
import { FormmstService } from '../formmst/formmst.service';

import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

import { FlowmstService } from 'src/webform/flowmst/flowmst.service';
import { UsersService } from 'src/amec/users/users.service';
import { OrgTreeService } from 'src/webform/org-tree/org-tree.service';
import { RepService } from 'src/webform/rep/rep.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { SequenceOrgService } from 'src/webform/sequence-org/sequence-org.service';

interface FormContext {
  ip: string;
  empno: string;
  inputempno: string;
  remark: string;
  nfrmno: number;
  vorgno: string;
  cyear: string;
  cyear2: string;
  CSTEPSTDX: number;
  flag?: number;
  nrunno?: number;
  emppos?: string;
  orgno?: string;
  represent?: string;
  VAPVNO?: string;
  CSTEPST?: number;
  query?: any;
}

interface form {
  NFRMNO: number;
  VORGNO: string;
  CYEAR: string;
  CYEAR2: string;
  NRUNNO: number;
}

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form, 'amecConnection')
    private readonly form: Repository<Form>,

    @InjectRepository(Flow, 'amecConnection')
    private readonly flow: Repository<Flow>,

    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
    private readonly formmstService: FormmstService,
    private readonly flowmstService: FlowmstService,
    private readonly usersService: UsersService,
    private readonly orgTreeService: OrgTreeService,
    private readonly repService: RepService,
    private readonly flowService: FlowService,
    private readonly orgPosService: OrgposService,
    private readonly sequenceOrgService: SequenceOrgService,
  ) {}

  findOne(fno, orgno, cyear, cyear2, nrunno) {
    return this.form.find({
      where: {
        NFRMNO: fno,
        VORGNO: orgno,
        CYEAR: cyear,
        CYEAR2: cyear2,
        NRUNNO: nrunno,
      },
      relations: {
        flow: true,
        creator: true,
      },
    });
  }

  waitforapprove(empno) {
    return this.flow
      .createQueryBuilder('flow')
      .leftJoinAndSelect('flow.form', 'form')
      .leftJoinAndSelect('form.formmst', 'formmst')
      .leftJoinAndSelect('form.flow', 'form_flow') // relation ใน entity ต้องตั้งชื่อถูก
      .where(
        '(flow.CSTEPST = :step AND flow.VAPVNO = :empno) OR (flow.CSTEPST = :step AND flow.VREPNO = :empno)',
        { step: '3', empno },
      )
      .andWhere('flow.CSTEPNO = form_flow.CSTEPNEXTNO')
      .getMany();
  }

  mine(empno) {
    return true;
  }

  async getFormno(dto: getFormnoDto): Promise<string> {
    const form = await this.formmstService.getFormmst(dto);
    console.log(form);
    // เอาเลขปี 2 หลักสุดท้าย
    const year2 = dto.CYEAR2.substring(2, 4); // ถ้า "2024" ได้ "24"

    // เติมเลข running 6 หลัก (ถ้าเป็นเลข integer ให้แปลงเป็น string ก่อน)
    const runNo = String(dto.NRUNNO).padStart(6, '0'); // เช่น 1 => "000001"
    return `${form[0].VANAME}${year2}-${runNo}`;
  }

  async create(dto: CreateFormDto, ip: string, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      const context: FormContext = {
        ip: ip,
        empno: dto.REQBY,
        inputempno: dto.INPUTBY,
        remark: dto.REMARK,
        nfrmno: dto.NFRMNO,
        vorgno: dto.VORGNO,
        cyear: dto.CYEAR,
        cyear2: new Date().getFullYear().toString(),
        CSTEPSTDX: 4,
      };

      this.setQuery(context);
      await this.setFormNo(context);
      const formData = await this.setFormValue(context);
      //   console.log('formData : ', formData);

      if (await this.insertForm(formData, runner)) {
        console.log('Form inserted successfully');
        context.flag = 0;
        const flowMaster = await this.flowmstService.getFlowMaster(
          context.nfrmno,
          context.vorgno,
          context.cyear,
        );
        console.log('flowMaster : ', flowMaster);
        await this.setOrganize(context);
        //   flowMaster.forEach(async (row: any) => {
        for (const row of flowMaster) {
          //   console.log('row : ', row.VPOSNO);

          switch (row.CTYPE) {
            case '1':
              await this.addFlow1(row, context, runner);
              break;
            case '2':
              await this.addFlow2(row, context, runner);
              break;
            case '3':
              context.VAPVNO = row.VAPVNO;
              context.CSTEPST =
                context.CSTEPSTDX <= 1 ? 1 : context.CSTEPSTDX - 1;
              context.CSTEPSTDX--;
              await this.getRepresent(row.VAPVNO, context, runner);
              const flow = this.setFlow(row, context);
              await this.flowService.insertFlow(flow, runner);
              break;
            default:
              break;
          }
        }
        // add first step
        // Unset CSTEPST from this.query if it exists
        if (context.query && 'CSTEPST' in context.query) {
          delete context.query['CSTEPST'];
        }
        context.query.CSTEPST = '3';
        context.query.NRUNNO = context.nrunno;

        const first = await this.flowService.getFlow(context.query, runner);
        console.log('first : ', first);
        await this.firstflow(first, context, runner);
        // add manager
        if (context.flag == 1) {
          await this.managerStep(context, runner);
        }

        context.query.CSTEPST = '0';
        const notuse = await this.flowService.getFlow(context.query, runner);
        for (const row of notuse) {
          await this.deleteFlowStep(row, context, runner);
        }

        //Draft form
        if (dto.DRAFT) {
          await this.saveDraft(dto.DRAFT, context, runner);
        }

        // await this.queryRunner.commitTransaction();
        if (localRunner) await localRunner.commitTransaction();
        return {
          status: true,
          message: 'Insert form successful',
          data: formData,
        };
      } else {
        // await this.queryRunner.commitTransaction();
        // console.log('Failed to insert form');
        // return { status: false, message: `Can't insert this form` };
        throw new Error('Failed to insert form'); // Throw an error to trigger rollback
      }
    } catch (error) {
      //   await this.queryRunner.rollbackTransaction();
      if (localRunner) await localRunner.rollbackTransaction();
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      //   await this.queryRunner.release();
      if (localRunner) await localRunner.release();
    }

    // return this.form.save(dto);
  }

  setQuery(context: FormContext) {
    console.log('set query');
    context.query = {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      CYEAR2: context.cyear2,
    };
  }

  async setFormNo(context: FormContext) {
    console.log('set form no');

    const form = await this.getFormNextRunNo(context);
    if (form.length > 0) {
      context.nrunno = form[0].NRUNNO + 1;
    } else {
      context.nrunno = 1;
    }
    console.log('nrunno : ', context.nrunno);
  }

  getFormNextRunNo(context: FormContext) {
    return this.form.find({
      where: context.query,
      order: {
        NRUNNO: 'DESC',
      },
      take: 1,
    });
  }

  async setFormValue(context: FormContext) {
    console.log('set form value');

    const condition = {
      NNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
    };
    const formmst = await this.formmstService.getFormmst(condition);
    // console.log('formmst : ', formmst);

    const today = new Date();
    // Set formDate to current date with time 00:00:00
    const formDateWithZeroTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      CYEAR2: context.cyear2,
      NRUNNO: context.nrunno,
      VREQNO: context.empno,
      VINPUTER: context.inputempno == '' ? context.empno : context.inputempno,
      VREMARK: context.remark,
      DREQDATE: formDateWithZeroTime,
      CREQTIME: new Date().toTimeString().split(' ')[0], // HH:MM:SS
      CST: 1,
      VFORMPAGE: formmst[0].VFORMPAGE,
      VREMOTE: context.ip,
    };
  }

  async insertForm(formData: any, queryRunner: QueryRunner): Promise<boolean> {
    try {
      await queryRunner.manager.save(Form, formData);
      return true;
    } catch (error) {
      console.error('Error inserting form:', error);
      throw error;
    }
  }

  async setOrganize(context: FormContext) {
    const user = await this.usersService.findEmp(context.empno);
    // console.log('user : ', user);

    context.emppos = user.SPOSCODE;
    if (user.SSECCODE == '00') {
      if (user.SDEPCODE == '00') {
        context.orgno = user.SDIVCODE;
      } else {
        context.orgno = user.SDEPCODE;
      }
    } else {
      context.orgno = user.SSECCODE;
    }
    console.log('position : ', context.emppos);
    console.log('orgno : ', context.orgno);
  }

  async addFlow1(data: any, context: FormContext, queryRunner: QueryRunner) {
    const val = await this.orgTreeService.getOrgTree(
      context.orgno,
      data.VPOSNO,
      context.empno,
      context.emppos,
    );
    context.flag = 1;
    if (val.length > 0) {
      context.flag = 2;
      for (const row of val) {
        await this.getRepresent(row.VEMPNO, context, queryRunner);
        context.VAPVNO = row.VEMPNO;
        context.CSTEPST = context.CSTEPSTDX <= 1 ? 1 : context.CSTEPSTDX - 1;
        context.CSTEPSTDX--;
        const flow = this.setFlow(data, context);
        await this.flowService.insertFlow(flow, queryRunner);
      }
    } else {
      context.VAPVNO = context.empno;
      await this.getRepresent(context.empno, context, queryRunner);
      context.CSTEPST = 0;
      const flow = this.setFlow(data, context);
      await this.flowService.insertFlow(flow, queryRunner);
    }
  }

  async addFlow2(data: any, context: FormContext, queryRunner: QueryRunner) {
    const val = await this.orgPosService.getOrgPos({
      VPOSNO: data.VPOSNO,
      VORGNO: data.VAPVORGNO,
    });
    // console.log('add flow2 val : ', val);
    if (val.length > 0) {
      for (const row of val) {
        await this.getRepresent(row.VEMPNO, context, queryRunner);
        context.VAPVNO = row.VEMPNO;
        context.CSTEPST = context.CSTEPSTDX <= 1 ? 1 : context.CSTEPSTDX - 1;
        context.CSTEPSTDX--;
        const flow = this.setFlow(data, context);
        await this.flowService.insertFlow(flow, queryRunner);
      }
    } else {
      await this.getRepresent(context.empno, context, queryRunner);
      context.VAPVNO = context.empno;
      context.CSTEPST = 0;
      const flow = this.setFlow(data, context);
      await this.flowService.insertFlow(flow, queryRunner);
    }
  }

  async getRepresent(
    empno: string,
    context: FormContext,
    queryRunner?: QueryRunner,
  ) {
    const condition = {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      VEMPNO: empno,
    };
    context.represent = await this.repService.getRepresent(
      condition,
      queryRunner,
    );
    // const data = await this.repService.getRep(condition);
    // context.represent = empno;
    // if (Array.isArray(data) && data.length > 0 && data[0]?.VREPNO !== '') {
    //   context.represent = data[0].VREPNO;
    // }
    // console.log('represent : ', context.represent);
  }

  setFlow(data: any, context: FormContext) {
    return {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      CYEAR2: context.cyear2,
      NRUNNO: context.nrunno,
      CSTEPNO: data.CSTEPNO,
      CSTEPNEXTNO: data.CSTEPNEXTNO,
      CSTEPST: context.CSTEPST.toString(),
      CSTART: '0',
      VPOSNO: data.VPOSNO,
      VAPVNO: context.VAPVNO,
      VREPNO: context.represent,
      CAPVSTNO: '0',
      CTYPE: data.CTYPE,
      VURL: data.VURL,
      CEXTDATA: data.CEXTDATA,
      CAPVTYPE: data.CAPVTYPE,
      CREJTYPE: data.CREJTYPE,
      CAPPLYALL: data.CAPPLYALL,
    };
  }

  async firstflow(data: any, context: FormContext, queryRunner: QueryRunner) {
    const today = new Date();
    // Set formDate to current date with time 00:00:00
    const formDateWithZeroTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const flow = {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      CYEAR2: context.cyear2,
      NRUNNO: context.nrunno,
      CSTEPNO: '--',
      CSTEPNEXTNO: data.length == 0 ? '00' : data[0].CSTEPNO,
      CSTART: '1',
      CSTEPST: '5',
      CTYPE: '0',
      VPOSNO: context.emppos,
      VAPVNO: context.empno,
      VREPNO: context.empno,
      VREALAPV: context.empno,
      CAPVSTNO: '1',
      DAPVDATE: formDateWithZeroTime,
      CAPVTIME: new Date().toTimeString().split(' ')[0],
      CAPVTYPE: '1',
      CREJTYPE: '1',
      CAPPLYALL: data.length == 0 ? '1' : data[0].CAPPLYALL,
      VURL: data.length == 0 ? '' : data[0].VURL,
      VREMARK: context.remark,
    };
    await this.flowService.insertFlow(flow, queryRunner);
  }

  async managerStep(context: FormContext, queryRunner: QueryRunner) {
    const manager = await this.sequenceOrgService.getManager(context.empno);
    const query = {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      CYEAR2: context.cyear2,
      NRUNNO: context.nrunno,
      CSTART: '1',
    };
    const nextstep = await this.flowService.getFlow(query, queryRunner);

    const query2 = {
      NNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
    };
    const url = await this.formmstService.getFormmst(query2);
    if (manager.length > 0) {
      await this.getRepresent(manager[0].HEADNO, context, queryRunner);
      //   const repManager = await this.getRepresent(manager[0].HEADNO);
      //   if (!repManager) {
      //     repno = manager[0].HEADNO;
      //   } else {
      //     repno = this.represent;
      //   }
      const flow = {
        NFRMNO: context.nfrmno,
        VORGNO: context.vorgno,
        CYEAR: context.cyear,
        CYEAR2: context.cyear2,
        NRUNNO: context.nrunno,
        CSTEPNO: '-1',
        CSTEPNEXTNO: nextstep.length == 0 ? '00' : nextstep[0].CSTEPNEXTNO,
        CSTART: '0',
        CSTEPST: '4',
        CTYPE: '0',
        VPOSNO: null,
        VAPVNO: manager[0].HEADNO,
        VREPNO: context.represent,
        VREALAPV: null,
        CAPVSTNO: '0',
        CAPVTIME: null,
        DAPVDATE: null,
        CAPVTYPE: '1',
        CREJTYPE: '1',
        CAPPLYALL: '3',
        VURL: url[0].VFORMPAGE,
        VREMARK: null,
      };
      await this.flowService.insertFlow(flow, queryRunner);

      //Update creater flow for set next step to manager
      const query3 = {
        condition: {
          NFRMNO: context.nfrmno,
          VORGNO: context.vorgno,
          CYEAR: context.cyear,
          CYEAR2: context.cyear2,
          NRUNNO: context.nrunno,
          CSTART: '1',
        },
        CSTEPNEXTNO: '-1',
      };
      this.flowService.updateFlow(query3, queryRunner);

      //Update other flow that step is not 1 for set next to after manager's step
      const query4 = {
        NFRMNO: context.nfrmno,
        VORGNO: context.vorgno,
        CYEAR: context.cyear,
        CYEAR2: context.cyear2,
        NRUNNO: context.nrunno,
      };
      this.flowService.reAlignFlow(query4, queryRunner);
    }
  }

  async deleteFlowStep(
    data: any,
    context: FormContext,
    queryRunner: QueryRunner,
  ) {
    await this.flowService.deleteFlow(context.query, queryRunner);
    if (context.query && 'CSTEPST' in context.query) {
      delete context.query['CSTEPST'];
    }
    context.query.CSTEPNEXTNO = data.CSTEPNO;
    context.query.NRUNNO = context.nrunno;
    await this.flowService.updateFlow(
      { condition: context.query, CSTEPNEXTNO: data.CSTEPNEXTNO },
      queryRunner,
    );
    if (data.CSTART == '1') {
      if (context.query && 'CSTEPNEXTNO' in context.query) {
        delete context.query['CSTEPNEXTNO'];
      }
      context.query.CSTEPNO = data.CSTEPNEXTNO;
      await this.flowService.updateFlow(
        { condition: context.query, CSTART: '1' },
        queryRunner,
      );
    }
  }

  async saveDraft(
    draft: string,
    context: FormContext,
    queryRunner: QueryRunner,
  ) {
    const formDraft: any = {
      NFRMNO: context.nfrmno,
      VORGNO: context.vorgno,
      CYEAR: context.cyear,
      CYEAR2: context.cyear2,
      NRUNNO: context.nrunno,
    };
    await this.updateForm({ condition: formDraft, CST: draft }, queryRunner);
    for (let i = 2; i <= 5; i++) {
      formDraft.CSTEPST = i.toString();
      const data: any = {
        CSTEPST: i == 5 ? '3' : (i - 1).toString(),
        CAPVTIME: null,
        DAPVDATE: null,
        VREALAPV: null,
        CAPVSTNO: '0',
      };
      this.flowService.updateFlow(
        { condition: formDraft, ...data },
        queryRunner,
      );
    }
  }

  async updateForm(
    dto: UpdateFormDto,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    let localRunner: QueryRunner | undefined;
    try {
      // ถ้ามี queryRunner ส่งมา ให้ใช้ตัวนั้น, ถ้าไม่มีก็สร้างใหม่
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const { condition, ...data } = dto;
      const runner = queryRunner || localRunner!;
      await runner.manager.getRepository(Form).update(condition, data);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async deleteForm(
    dto: UpdateFormDto,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      //   const { condition, ...data } = dto;
      await runner.manager.getRepository(Form).delete(dto);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async deleteFlowAndForm(dto: UpdateFormDto): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log('delete flow and form data : ', dto);

    try {
      const condition = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      };
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // Delete form data
      await this.flowService.deleteFlow(condition, queryRunner);
      await this.deleteForm(condition, queryRunner);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCst(form: form, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Form)
      : this.form;
    const cst = await repo.findOne({
      where: {
        NFRMNO: form.NFRMNO,
        VORGNO: form.VORGNO,
        CYEAR: form.CYEAR,
        CYEAR2: form.CYEAR2,
        NRUNNO: form.NRUNNO,
      },
      select: {
        CST: true,
      },
    });
    return cst;
  }

  async getFormDetail(form: form) {
    // const formDetail = await this.form.findOne({
    //   where: {
    //     NFRMNO: form.NFRMNO,
    //     VORGNO: form.VORGNO,
    //     CYEAR: form.CYEAR,
    //     CYEAR2: form.CYEAR2,
    //     NRUNNO: form.NRUNNO,
    //   },
    // });
    const formDetail = await this.dataSource
      .createQueryBuilder()
      .select('F.*, A.SNAME AS VINPUTNAME, B.SNAME AS VREQNAME')
      .from('FORM', 'F')
      .innerJoin('AMECUSERALL', 'A', 'A.SEMPNO = F.VINPUTER')
      .innerJoin('AMECUSERALL', 'B', 'B.SEMPNO = F.VREQNO')
      .where('F.NFRMNO = :NFRMNO', { NFRMNO: form.NFRMNO })
      .andWhere('F.VORGNO = :VORGNO', { VORGNO: form.VORGNO })
      .andWhere('F.CYEAR = :CYEAR', { CYEAR: form.CYEAR })
      .andWhere('F.CYEAR2 = :CYEAR2', { CYEAR2: form.CYEAR2 })
      .andWhere('F.NRUNNO = :NRUNNO', { NRUNNO: form.NRUNNO })
      .getRawOne();
    return {
      ...formDetail,
      link: await this.createLink(form),
      FORMNO: await this.getFormno(form),
    };
  }

  async createLink(form: form) {
    let link = '';
    const frmmst = await this.formmstService.getFormmst({
      NNO: form.NFRMNO,
      VORGNO: form.VORGNO,
      CYEAR: form.CYEAR,
    });
    if (frmmst.length > 0) {
      const frmmstDetail = frmmst[0];
      link = frmmstDetail.VFORMPAGE.includes('amecweb')
        ? frmmstDetail.VFORMPAGE
        : `${process.env.APP_WEBFLOW}/${frmmstDetail.VFORMPAGE}`;
      link += `?no=${form.NFRMNO}&orgNo=${form.VORGNO}&y=${form.CYEAR}&y2=${form.CYEAR2}&runNo=${form.NRUNNO}&empno=`;
    }
    return link;
  }
}
