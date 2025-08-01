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

  private repo: Repository<any>;
  private host:string;
  private ip:string;

  private nfrmno: number;
  private vorgno: string;
  private cyear: string;
  private cyear2 = new Date().getFullYear().toString(); // ปีปัจจุบัน
  private empno: string;
  private inputempno: string;
  private remark: string;

  private nrunno: number;
  private query: any;
  private flag: number;

  //user info
  private orgno: string;
  private emppos: string;
  private represent: string;
  //Flow org. info
  private VAPVNO: string;
  private CAPVSTNO: string;
  private CSTEPST: number;
  private CSTEPSTDX: number;

  private queryRunner: QueryRunner;

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

  async create(dto: CreateFormDto, ip: string) {
    this.queryRunner = this.dataSource.createQueryRunner();
    try {
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      this.ip = ip;
      this.empno = dto.REQBY;
      this.inputempno = dto.INPUTBY;
      this.remark = dto.REMARK;
      this.nfrmno = dto.NFRMNO;
      this.vorgno = dto.VORGNO;
      this.cyear = dto.CYEAR;
      this.CSTEPSTDX = 4;

      this.setQuery();
      await this.setFormNo();
      const formData = await this.setFormValue();
      //   console.log('formData : ', formData);

      if (await this.insertForm(formData)) {
        console.log('Form inserted successfully');
        this.flag = 0;
        const flowMaster = await this.flowmstService.getFlowMaster(
          this.nfrmno,
          this.vorgno,
          this.cyear,
        );
        console.log('flowMaster : ', flowMaster);
        await this.setOrganize();
        //   flowMaster.forEach(async (row: any) => {
        for (const row of flowMaster) {
          //   console.log('row : ', row.VPOSNO);

          switch (row.CTYPE) {
            case '1':
              await this.addFlow1(row);
              break;
            case '2':
              await this.addFlow2(row);
              break;
            case '3':
              this.VAPVNO = row.VAPVNO;
              this.CSTEPST = this.CSTEPSTDX <= 1 ? 1 : this.CSTEPSTDX - 1;
              this.CSTEPSTDX--;
              await this.getRepresent(row.VAPVNO);
              const flow = this.setFlow(row);
              await this.flowService.insertFlow(flow, this.queryRunner);
              break;
            default:
              break;
          }
        }
        // add first step
        // Unset CSTEPST from this.query if it exists
        if (this.query && 'CSTEPST' in this.query) {
          delete this.query['CSTEPST'];
        }
        this.query.CSTEPST = '3';
        this.query.NRUNNO = this.nrunno;
        // console.log('------------------------------------------------');
        // console.log(await this.flowService.getFlow({
        //     NFRMNO: this.nfrmno,
        //     VORGNO: this.vorgno,
        //     CYEAR: this.cyear,
        //     CYEAR2: this.cyear2,
        //     NRUNNO: this.nrunno,
        // }, this.host, this.queryRunner));

        // console.log('test query : ', this.query);

        const first = await this.flowService.getFlow(
          this.query,
          this.queryRunner,
        );
        console.log('first : ', first);
        await this.firstflow(first);
        // add manager
        if (this.flag == 1) {
          this.managerStep();
        }

        this.query.CSTEPST = '0';
        const notuse = await this.flowService.getFlow(
          this.query,
          this.queryRunner,
        );
        for (const row of notuse) {
          await this.deleteFlowStep(row);
        }

        //Draft form
        if (dto.DRAFT) {
          await this.saveDraft(dto.DRAFT);
        }

        await this.queryRunner.commitTransaction();
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
      await this.queryRunner.rollbackTransaction();
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      await this.queryRunner.release();
    }

    // return this.form.save(dto);
  }

  setQuery() {
    console.log('set query');

    this.query = {
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      CYEAR2: this.cyear2,
      // CYEAR2: new Date().getFullYear().toString(),
    };
  }

  async setFormNo() {
    console.log('set form no');

    const form = await this.getFormNextRunNo();
    if (form.length > 0) {
      this.nrunno = form[0].NRUNNO + 1;
    } else {
      this.nrunno = 1;
    }
    console.log('nrunno : ', this.nrunno);
  }

  getFormNextRunNo() {
    return this.form.find({
      where: this.query,
      order: {
        NRUNNO: 'DESC',
      },
      take: 1,
    });
  }

  async setFormValue() {
    console.log('set form value');

    const condition = {
      NNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
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
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      CYEAR2: this.cyear2,
      NRUNNO: this.nrunno,
      VREQNO: this.empno,
      VINPUTER: this.inputempno == '' ? this.empno : this.inputempno,
      VREMARK: this.remark,
      DREQDATE: formDateWithZeroTime,
      CREQTIME: new Date().toTimeString().split(' ')[0], // HH:MM:SS
      CST: 1,
      VFORMPAGE: formmst[0].VFORMPAGE,
      VREMOTE: this.ip,
    };
  }

  async insertForm(formData: any): Promise<boolean> {
    // console.log('insert form data : ', formData);
    try {
      await this.queryRunner.manager.save(Form, formData);
      return true;
    } catch (error) {
      console.error('Error inserting form:', error);
    //   return false;
      throw error;
    }
    // const queryRunner = this.dataSource.createQueryRunner();
    // try {
    //   await queryRunner.connect();
    //   await queryRunner.startTransaction();
    //   await queryRunner.manager.save(this.repo.target, formData);
    //   await queryRunner.commitTransaction();
    //   //   await this.repo.save(formData);
    //   return true;
    // } catch (error) {
    //   console.error('Error inserting form:', error);
    //   console.log(error);
    //   await queryRunner.rollbackTransaction();
    //   return false;
    // } finally {
    //   await queryRunner.release();
    // }
  }

  async setOrganize() {
    const user = await this.usersService.findEmp(this.empno);
    // console.log('user : ', user);

    this.emppos = user.SPOSCODE;
    if (user.SSECCODE == '00') {
      if (user.SDEPCODE == '00') {
        this.orgno = user.SDIVCODE;
      } else {
        this.orgno = user.SDEPCODE;
      }
    } else {
      this.orgno = user.SSECCODE;
    }
    console.log('position : ', this.emppos);
    console.log('orgno : ', this.orgno);
  }

  async addFlow1(data: any) {
    const val = await this.orgTreeService.getOrgTree(
      this.orgno,
      data.VPOSNO,
      this.empno,
      this.emppos,
    );
    this.flag = 1;
    if (val.length > 0) {
      this.flag = 2;
      for (const row of val) {
        await this.getRepresent(row.VEMPNO);
        this.VAPVNO = row.VEMPNO;
        this.CSTEPST = this.CSTEPSTDX <= 1 ? 1 : this.CSTEPSTDX - 1;
        this.CSTEPSTDX--;
        const flow = this.setFlow(data);
        await this.flowService.insertFlow(flow, this.queryRunner);
      }
    } else {
      this.VAPVNO = this.empno;
      await this.getRepresent(this.empno);
      this.CSTEPST = 0;
      const flow = this.setFlow(data);
      await this.flowService.insertFlow(flow, this.queryRunner);
    }
  }

  async addFlow2(data: any) {
    const val = await this.orgPosService.getOrgPos({
      VPOSNO: data.VPOSNO,
      VORGNO: data.VAPVORGNO,
    });
    // console.log('add flow2 val : ', val);
    if (val.length > 0) {
      for (const row of val) {
        await this.getRepresent(row.VEMPNO);
        this.VAPVNO = row.VEMPNO;
        this.CSTEPST = this.CSTEPSTDX <= 1 ? 1 : this.CSTEPSTDX - 1;
        this.CSTEPSTDX--;
        const flow = this.setFlow(data);
        await this.flowService.insertFlow(flow, this.queryRunner);
      }
    } else {
      await this.getRepresent(this.empno);
      this.VAPVNO = this.empno;
      this.CSTEPST = 0;
      const flow = this.setFlow(data);
      await this.flowService.insertFlow(flow, this.queryRunner);
    }
  }

  async getRepresent(empno: string) {
    const condition = {
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      VEMPNO: empno,
    };
    const data = await this.repService.getRep(condition);
    this.represent = empno;
    if (Array.isArray(data) && data.length > 0 && data[0]?.VREPNO !== '') {
      this.represent = data[0].VREPNO;
    }
    console.log('represent : ', this.represent);
  }

  setFlow(data: any) {
    return {
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      CYEAR2: this.cyear2,
      NRUNNO: this.nrunno,
      CSTEPNO: data.CSTEPNO,
      CSTEPNEXTNO: data.CSTEPNEXTNO,
      CSTEPST: this.CSTEPST.toString(),
      CSTART: '0',
      VPOSNO: data.VPOSNO,
      VAPVNO: this.VAPVNO,
      VREPNO: this.represent,
      CAPVSTNO: '0',
      CTYPE: data.CTYPE,
      VURL: data.VURL,
      CEXTDATA: data.CEXTDATA,
      CAPVTYPE: data.CAPVTYPE,
      CREJTYPE: data.CREJTYPE,
      CAPPLYALL: data.CAPPLYALL,
    };
  }

  async firstflow(data: any) {
    const today = new Date();
    // Set formDate to current date with time 00:00:00
    const formDateWithZeroTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const flow = {
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      CYEAR2: this.cyear2,
      NRUNNO: this.nrunno,
      CSTEPNO: '--',
      CSTEPNEXTNO: data.length == 0 ? '00' : data[0].CSTEPNO,
      CSTART: '1',
      CSTEPST: '5',
      CTYPE: '0',
      VPOSNO: this.emppos,
      VAPVNO: this.empno,
      VREPNO: this.empno,
      VREALAPV: this.empno,
      CAPVSTNO: '1',
      DAPVDATE: formDateWithZeroTime,
      CAPVTIME: new Date().toTimeString().split(' ')[0],
      CAPVTYPE: '1',
      CREJTYPE: '1',
      CAPPLYALL: data.length == 0 ? '1' : data[0].CAPPLYALL,
      VURL: data.length == 0 ? '' : data[0].VURL,
      VREMARK: this.remark,
    };
    await this.flowService.insertFlow(flow, this.queryRunner);
  }

  async managerStep() {
    const manager = await this.sequenceOrgService.getManager(this.empno);
    const query = {
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      CYEAR2: this.cyear2,
      NRUNNO: this.nrunno,
      CSTART: '1',
    };
    const nextstep = await this.flowService.getFlow(
      query,
      this.queryRunner,
    );

    const query2 = {
      NNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
    };
    const url = await this.formmstService.getFormmst(query2);
    if (manager.length > 0) {
      await this.getRepresent(manager[0].HEADNO);
      //   const repManager = await this.getRepresent(manager[0].HEADNO);
      //   if (!repManager) {
      //     repno = manager[0].HEADNO;
      //   } else {
      //     repno = this.represent;
      //   }
      const flow = {
        NFRMNO: this.nfrmno,
        VORGNO: this.vorgno,
        CYEAR: this.cyear,
        CYEAR2: this.cyear2,
        NRUNNO: this.nrunno,
        CSTEPNO: '-1',
        CSTEPNEXTNO: nextstep.length == 0 ? '00' : nextstep[0].CSTEPNEXTNO,
        CSTART: '0',
        CSTEPST: '4',
        CTYPE: '0',
        VPOSNO: null,
        VAPVNO: manager[0].HEADNO,
        VREPNO: this.represent,
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
      await this.flowService.insertFlow(flow, this.queryRunner);

      //Update creater flow for set next step to manager
      const query3 = {
        condition: {
          NFRMNO: this.nfrmno,
          VORGNO: this.vorgno,
          CYEAR: this.cyear,
          CYEAR2: this.cyear2,
          NRUNNO: this.nrunno,
          CSTART: '1',
        },
        CSTEPNEXTNO: '-1',
      };
      this.flowService.updateFlow(query3, this.queryRunner);

      //Update other flow that step is not 1 for set next to after manager's step
      const query4 = {
        NFRMNO: this.nfrmno,
        VORGNO: this.vorgno,
        CYEAR: this.cyear,
        CYEAR2: this.cyear2,
        NRUNNO: this.nrunno,
      };
      this.flowService.reAlignFlow(query4, this.queryRunner);
    }
  }

  async deleteFlowStep(data: any) {
    await this.flowService.deleteFlow(this.query, this.queryRunner);
    if (this.query && 'CSTEPST' in this.query) {
      delete this.query['CSTEPST'];
    }
    this.query.CSTEPNEXTNO = data.CSTEPNO;
    this.query.NRUNNO = this.nrunno;
    await this.flowService.updateFlow(
      { condition: this.query, CSTEPNEXTNO: data.CSTEPNEXTNO },
      this.queryRunner,
    );
    if (data.CSTART == '1') {
      if (this.query && 'CSTEPNEXTNO' in this.query) {
        delete this.query['CSTEPNEXTNO'];
      }
      this.query.CSTEPNO = data.CSTEPNEXTNO;
      await this.flowService.updateFlow(
        { condition: this.query, CSTART: '1' },
        this.queryRunner,
      );
    }
  }

  async saveDraft(draft: string) {
    const formDraft: any = {
      NFRMNO: this.nfrmno,
      VORGNO: this.vorgno,
      CYEAR: this.cyear,
      CYEAR2: this.cyear2,
      NRUNNO: this.nrunno,
    };
    await this.updateForm(
      { condition: formDraft, CST: draft },
      this.queryRunner,
    );
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
        this.queryRunner,
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
}
