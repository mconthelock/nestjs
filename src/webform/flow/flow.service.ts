import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, In } from 'typeorm';

import { Flow } from './entities/flow.entity';

import { SearchFlowDto } from './dto/search-flow.dto';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { empnoFormDto } from '../form/dto/empno-form.dto';
import { FormDto } from '../form/dto/form.dto';
import { doactionFlowDto } from './dto/doaction-flow.dto';

import { RepService } from '../rep/rep.service';
import { FormService } from '../form/form.service';
import { UsersService } from 'src/amec/users/users.service';
import { checkHostTest } from 'src/common/helpers/repo.helper';

import {
  getBase64Image,
  getBase64ImageFromUrl,
  joinPaths,
} from 'src/common/utils/files.utils';
import { formatDate, now } from 'src/common/utils/dayjs.utils';
import { getSafeFields } from 'src/common/utils/Fields.utils';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow, 'amecConnection')
    private readonly flowRepo: Repository<Flow>,

    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
    private readonly repService: RepService,
    @Inject(forwardRef(() => FormService))
    private readonly formService: FormService,
    private readonly usersService: UsersService,
  ) {}

  private readonly APV_TYPE_SINGLE = '1';
  private readonly APV_TYPE_MULTIPLE_CAN = '2';
  private readonly APV_TYPE_MULTIPLE_CO = '3';
  private readonly APV_TYPE_MULTIPLE = '3';
  private readonly APPLY_ALL_NONE = '0';
  private readonly APPLY_ALL_APV = '1';
  private readonly APPLY_ALL_REJ = '2';
  private readonly APPLY_ALL_BOTH = '3';
  private readonly APV_NONE = '0';
  private readonly APV_APPROVE = '1';
  private readonly APV_REJECT = '2';
  private readonly APV_UNKNOWN = '3';
  private readonly APV_RETURN = '4';
  private readonly STEP_NOT_USE = '0';
  private readonly STEP_USE = '1';
  private readonly STEP_NORMAL = '1';
  private readonly STEP_WAIT = '2';
  private readonly STEP_READY = '3';
  private readonly STEP_PASS = '4';
  private readonly STEP_APPROVE = '5';
  private readonly STEP_REJECT = '6';
  private readonly STEP_SKIP = '7';
  private readonly STEP_DIE = '8';
  private readonly STEP_RETURN = '9';
  private readonly FLOW_PREPARE = '0';
  private readonly FLOW_ON_GOING = '1';
  private readonly FLOW_RUNNING = '1';
  private readonly FLOW_APPROVE = '2';
  private readonly FLOW_REJECT = '3';

  private readonly FLOW_FIELDS = this.flowRepo.metadata.columns.map(
    (c) => c.propertyName,
  );

  async insertFlow(
    dto: CreateFlowDto,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    // console.log('insert flow data : ', dto);
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      await runner.manager.save(Flow, dto);
      if (localRunner) await localRunner.commitTransaction();
      //   await this.repo.save(formData);
      //   console.log('-----------------Flow inserted successfully------------------');

      return true;
    } catch (error) {
      console.error('Error inserting flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
      //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  getFlow(dto: SearchFlowDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Flow)
      : this.flowRepo;
    // console.log('get flow data : ', dto);
    // const where: any = {};
    // for (const key in dto) {
    //   if (['CAPVSTNO'].includes(key)) {
    //     where[key] = Array.isArray(dto[key]) ? In(dto[key]) : dto[key];
    //   } else {
    //     where[key] = dto[key];
    //   }
    // }
    // return repo.find({
    //   where: where,
    // });
    const query = repo
      .createQueryBuilder('flow')
      .distinct(dto.distinct == true); // เปิด distinct

    for (const key in dto) {
      if (dto[key] == null || key == 'distinct') continue;

      if (key === 'CAPVSTNO') {
        if (Array.isArray(dto[key])) {
          query.andWhere(`flow.${key} IN (:...${key})`, { [key]: dto[key] });
        } else {
          query.andWhere(`flow.${key} = :${key}`, { [key]: dto[key] });
        }
      } else if (key === 'fields') {
        const select = getSafeFields(dto.fields, this.FLOW_FIELDS);
        select.length > 0 && query.select(select.map((f) => `flow.${f}`));
      } else {
        query.andWhere(`flow.${key} = :${key}`, { [key]: dto[key] });
      }
    }
    return query.getMany();
  }

  async updateFlow(
    dto: UpdateFlowDto,
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
      const { condition, ...data } = dto;

      if (data.VREPNO) {
        data.VREPNO = await this.repService.getRepresent(
          {
            NFRMNO: condition.NFRMNO,
            VORGNO: condition.VORGNO,
            CYEAR: condition.CYEAR,
            VEMPNO: data.VREPNO,
          },
          runner,
        );
      }

      // await queryRunner.manager.save(repo.target, dto);
      await runner.manager.getRepository(Flow).update(condition, data);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error update flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
      //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async reAlignFlow(
    dto: UpdateFlowDto,
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

      await runner.manager
        .getRepository(Flow)
        .createQueryBuilder()
        .update()
        .set({ CSTEPST: () => 'CSTEPST - 1' })
        .where(dto)
        .andWhere('CSTEPST > 1')
        .andWhere('CSTEPST < 5')
        .execute();

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error re-aligning flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
      //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async deleteFlow(
    dto: UpdateFlowDto,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    let localRunner: QueryRunner | undefined;
    console.log('delete flow data : ', dto);

    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      await runner.manager.getRepository(Flow).delete(dto);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error deleting flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
      //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  //---------------------------- Show flow Start --------------------------------

  async showFlow(form: FormDto, host: string, queryRunner?: QueryRunner) {
    const flowData = await this.getFlowTree(form, queryRunner);
    const html = await this.generateHtml(flowData, form, host);
    return {
      status: true,
      html: html,
      data: flowData,
    };
  }

  async getFlowTree(form: FormDto, queryRunner?: QueryRunner) {
    const dataSource = queryRunner ? queryRunner : this.dataSource;
    const sql = `
    SELECT DISTINCT LEVEL, CSTEPNO, CSTEPST, VAPVNO, NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, SNAME, VNAME, DAPVDATE, CAPVTIME, VREMARK,  VREPNO, VREALAPV 
    FROM FLOW, AMECUSERALL, stepmst  WHERE  FLOW.VAPVNO = SEMPNO and flow.CSTEPNO = cno 
    start with CSTART = '1' and 
    NFRMNO = :1 and VORGNO = :2 and CYEAR = :3 
    and CYEAR2 = :4 and NRUNNO = :5
    connect by 
    NFRMNO = prior NFRMNO and VORGNO = prior VORGNO and CYEAR = prior CYEAR 
    and CYEAR2 = prior CYEAR2 and NRUNNO = prior NRUNNO 
    and CSTEPNO = prior CSTEPNEXTNO 
    order by level
        `;
    return await dataSource.query(sql, [
      form.NFRMNO,
      form.VORGNO,
      form.CYEAR,
      form.CYEAR2,
      form.NRUNNO,
    ]);
  }

  async generateHtml(flowData: any, form: FormDto, host: string) {
    const webflow = checkHostTest(host)
      ? 'http://webflow.mitsubishielevatorasia.co.th/formtest/'
      : 'http://webflow.mitsubishielevatorasia.co.th/form/';
    const status = [
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/stepdie.gif'),
      '',
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/wait.gif'),
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/ready.gif'),
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/approver.gif'),
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/approve.gif'),
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/reject.gif'),
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/reject.gif'),
      '',
      await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/stepdie.gif'),
      '',
    ];
    let html = `
    <div style="display:flex; overflow:scroll;">
        <div style="margin-left:auto; margin-right:auto;">
        <table style="width: 100%; padding:15px; border:solid 1px #000;  margin-left: auto; margin-right: auto; border-collapse: collapse;font-size: 0.8rem;">
            <thead style="background: #aaccee; color: #323232;">
                <th colspan="7" style="text-align:center; padding:5px">Flow</th>
            </thead>
            <tbody style="background: #fffff0; color: #626262;">
            <tr>
                <th style="border: 1px solid blue; padding: 5px 8px;"></th>
                <th style="border: 1px solid blue; padding: 5px 8px; display:none;">Step</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Emp-no</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Emp-name</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Date</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Time</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Remark</th>
            </tr>
    `;

    for (const step of flowData) {
      let apv = '';
      let remark = '';
      if (step.VAPVNO != step.VREPNO) {
        if (step.VREALAPV == step.VAPVNO)
          apv += `<img style="width:23px; display: inline" src="${status[4]}"/>`;
        apv += `<a href="javascript:var winRem = window.open('${webflow}usrInfo.asp?uid=${step.VAPVNO}', 'user info', 'width=600,height=250'); winRem.focus();">${step.VAPVNO}</a>`;
        apv += ' / ';
        if (step.VREALAPV == step.VREPNO)
          apv += `<img style="width:23px; display: inline" src="${status[4]}"/>`;
        apv += `<a href="javascript:var winRem = window.open('${webflow}usrInfo.asp?uid=${step.VREPNO}', 'user info', 'width=600,height=250'); winRem.focus();">${step.VREPNO}</a>`;
      } else {
        apv += `<a href="javascript:var winRem = window.open('${webflow}usrInfo.asp?uid=${step.VAPVNO}', 'user info', 'width=600,height=250'); winRem.focus();">${step.VAPVNO}</a>`;
      }

      if (step.VREMARK) {
        remark =
          '<button  style="background-color:#efefef; padding:3px; border:solid 1px #767676; border-radius:5px; color:#000;"  onclick="javascript:var winRem = window.open(\'' +
          webflow +
          'showRem.asp?uid=' +
          step.VAPVNO +
          '&no=' +
          step.NFRMNO +
          '&orgNo=' +
          step.VORGNO +
          '&y=' +
          step.CYEAR +
          '&y2=' +
          step.CYEAR2 +
          '&runNo=' +
          step.NRUNNO +
          '&step=' +
          step.CSTEPNO +
          "', 'Remark', 'width=600,height=250'); winRem.focus();\">Remark</button>";
      }

      html += `<tr>
            <td style="border: 1px solid blue;"><img style="width:23px;"  src="${status[step.CSTEPST]}"/></td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap; display:none;">${step.VNAME}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap;text-align: center; color:blue;">${apv}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap;">${step.SNAME}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap;">${formatDate(step.DAPVDATE, 'DD-MMM-YY') || ''}</td>
            <td style="border: 1px solid blue; padding: 5px 8px;">${step.CAPVTIME || ''}</td>
            <td style="border: 1px solid blue; padding: 5px 8px;">${remark}</td>
        </tr>`;
    }

    html += `<tr><td colspan="7" style="border: 1px solid blue; padding: 5px 8px;text-align: center; background: #fff;"><b>${await this.getFlowStatusName(form)}</b></td></tr>
            </tbody>
        </table>
        </div>
    </div>
    `;

    return html;
  }

  async getFlowStatusName(form: FormDto) {
    const formcst = await this.formService.getCst(form);
    const status = formcst.CST;
    console.log('status : ', status);

    let html = '';
    const msg = '<font color="#000000">Status: </font>';
    switch (status) {
      case this.FLOW_RUNNING:
        html =
          msg +
          '&nbsp;<font color="#' +
          this.flowStatusColor(status) +
          '">Running</font>';
        break;
      case this.FLOW_APPROVE:
        html =
          msg +
          '&nbsp;<font color="#' +
          this.flowStatusColor(status) +
          '">Approve</font>';
        break;
      case this.FLOW_REJECT:
        html =
          msg +
          '&nbsp;<font color="#' +
          this.flowStatusColor(status) +
          '">Reject</font>';
        break;
      default:
        html =
          msg +
          '&nbsp;<font color="#' +
          this.flowStatusColor(status) +
          '">Unknown!</font>';
    }

    return html;
  }

  flowStatusColor(status: string) {
    let color = '';
    switch (status) {
      case this.FLOW_RUNNING:
        color = '0000FF';
        break;
      case this.FLOW_REJECT:
        color = 'FF0000';
        break;
      case this.FLOW_APPROVE:
        color = '009900';
        break;
    }
    return color;
  }

  //---------------------------- Show flow End --------------------------------

  async getEmpFlowStepReady(form: empnoFormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Flow)
      : this.flowRepo;
    return await repo
      .createQueryBuilder('f')
      .where('f.NFRMNO = :nfrmno', { nfrmno: form.NFRMNO })
      .andWhere('f.VORGNO = :vorgno', { vorgno: form.VORGNO })
      .andWhere('f.CYEAR = :cyear', { cyear: form.CYEAR })
      .andWhere('f.CYEAR2 = :cyear2', { cyear2: form.CYEAR2 })
      .andWhere('f.NRUNNO = :nrunno', { nrunno: form.NRUNNO })
      .andWhere('(f.VAPVNO = :vapvno OR f.VREPNO = :vap)', {
        vap: form.EMPNO,
        vapvno: form.EMPNO,
      })
      .andWhere('f.CSTEPST = :step', { step: this.STEP_READY })
      .getMany();
  }

  async checkReturnb(dto: empnoFormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Flow)
      : this.flowRepo;
    const flow = await this.getEmpFlowStepReady(dto);
    if (flow.length === 0) {
      return false;
    }
    const cstep = flow[0].CSTEPNEXTNO;
    const res = await repo
      .createQueryBuilder('f')
      .where('f.NFRMNO = :nfrmno', { nfrmno: dto.NFRMNO })
      .andWhere('f.VORGNO = :vorgno', { vorgno: dto.VORGNO })
      .andWhere('f.CYEAR = :cyear', { cyear: dto.CYEAR })
      .andWhere('f.CYEAR2 = :cyear2', { cyear2: dto.CYEAR2 })
      .andWhere('f.NRUNNO = :nrunno', { nrunno: dto.NRUNNO })
      .andWhere('f.CSTEPNO = :step', { step: cstep })
      .andWhere('VREMOTE IS NOT NULL')
      .getMany();
    return res.length > 0;
  }

  async checkReturn(form: empnoFormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Flow)
      : this.flowRepo;
    const res = await repo
      .createQueryBuilder('f')
      .where('f.NFRMNO = :nfrmno', { nfrmno: form.NFRMNO })
      .andWhere('f.VORGNO = :vorgno', { vorgno: form.VORGNO })
      .andWhere('f.CYEAR = :cyear', { cyear: form.CYEAR })
      .andWhere('f.CYEAR2 = :cyear2', { cyear2: form.CYEAR2 })
      .andWhere('f.NRUNNO = :nrunno', { nrunno: form.NRUNNO })
      .andWhere('(f.VAPVNO = :vapvno OR f.VREPNO = :vap)', {
        vap: form.EMPNO,
        vapvno: form.EMPNO,
      })
      .andWhere("f.CSTEPNO = '--'")
      .andWhere('f.CSTEPST = :step', { step: this.STEP_READY })
      .getMany();
    return res.length > 0;
  }

  async getExtData(dto: empnoFormDto) {
    console.log(dto);

    const flow = await this.getEmpFlowStepReady(dto);
    if (flow.length === 0) {
      return '';
    }
    return flow[0].CEXTDATA;
  }

  //------------------------------ Do action Start ------------------------------
  async doAction(
    dto: doactionFlowDto,
    ip: string,
    queryRunner?: QueryRunner,
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    let localRunner: QueryRunner | undefined,
      whatAction: string,
      stepAction: string,
      sql: string,
      params: any,
      //   apvClause: string = '',
      updateFlow: boolean;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      const {
        NFRMNO,
        VORGNO,
        CYEAR,
        CYEAR2,
        NRUNNO,
        ACTION,
        EMPNO,
        REMARK = '',
      } = dto;
      const form = {
        NFRMNO: NFRMNO,
        VORGNO: VORGNO,
        CYEAR: CYEAR,
        CYEAR2: CYEAR2,
        NRUNNO: NRUNNO,
      };
      // CHECK USER INFO
      const userInfo = await this.usersService.findEmp(dto.EMPNO);
      if (!userInfo) {
        throw new Error('User not found');
      }
      // CHECK STEP STATUS
      const checkStep = await this.getEmpFlowStepReady(dto, runner);
      if (checkStep.length === 0) {
        throw new Error('Ready step not found!');
      }
      const flow = checkStep[0];
      params = {
        ...form,
        DAPVDATE: now(),
        CAPVTIME: now('hh:mm:ss'),
        VREMARK: REMARK,
        VREMOTE: ip,
        VREALAPV: EMPNO,
        CAPVSTNO: this.APV_NONE,
      };

      //UPDATE ALL STEP
      switch (ACTION) {
        case 'approve':
          whatAction = this.APV_APPROVE;
          stepAction = this.STEP_APPROVE;
          await this.doactionUpdateFlow(
            flow,
            { ...params, whatAction, stepAction },
            runner,
          );
          const checkNextStep = await this.getFlow(
            { ...form, CAPVSTNO: this.APV_NONE, CSTEPNO: flow.CSTEPNO },
            runner,
          );
          const updateNextStep = checkNextStep.length == 0 ? true : false;
          if (updateNextStep) {
            //UPDATE STEP NEXT STATUS
            await this.updateStepNextStatus(form, runner);
            //UPDATE NEXT NEXT STEP (WAIT)
            await this.updateNextStepWait(form, runner);
            // this.sendMailToApprover(form); // send email to approver
          }
          break;
        case 'reject':
          whatAction = this.APV_REJECT;
          stepAction = this.STEP_REJECT;
          await this.doactionUpdateFlow(
            flow,
            { ...params, whatAction, stepAction },
            runner,
          );
          //Check for updating flow status
          if (flow.CAPVTYPE == this.APV_TYPE_MULTIPLE_CO) {
            const checkUpdate = await this.getFlow(
              {
                ...form,
                CAPVSTNO: [this.APV_NONE, this.APV_APPROVE],
                CSTEPNO: flow.CSTEPNO,
              },
              runner,
            );
            updateFlow = checkUpdate.length == 0 ? true : false;
          } else {
            updateFlow = true;
          }
          //Start updating flow status
          if (updateFlow) {
            //UPDATE SINGLE STEP
            await this.updateSingleStep(form, runner);
          } else {
            //UPDATE STEP NEXT STATUS
            await this.updateStepNextStatus(form, runner);
            //UPDATE NEXT NEXT STEP (WAIT)
            await this.updateNextStepWait(form, runner);
          }
          break;
        case 'return':
          whatAction = this.APV_NONE;
          stepAction = this.STEP_READY;
          await this.doactionUpdateFlow(
            flow,
            { ...params, whatAction, stepAction },
            runner,
          );
          await this.updateStepWaitToNormal(form, runner);
          await this.updateStepReadyToWait(form, runner);
          await this.updateStepReqToReady(form, runner);
          break;
        case 'returnp':
          whatAction = this.APV_NONE;
          stepAction = this.STEP_READY;
          await this.doactionUpdateFlow(
            flow,
            { ...params, whatAction, stepAction },
            runner,
          );
          await this.updateAllStepToNormal(form, runner);
          await this.updateStepReqToReady(form, runner);
          await this.updateStepReqNextToWait(form, runner);
          break;
        case 'returnb':
          whatAction = this.APV_NONE;
          stepAction = this.STEP_READY;
          await this.doactionUpdateFlow(
            flow,
            { ...params, whatAction, stepAction },
            runner,
          );
          await this.updateStepWaitToNormal(form, runner);
          await this.updateStepReadyToWait(form, runner);
          await this.updateStepReqToReadyB(form, runner);
          break;
        default:
          throw new Error('Invalid action!');
      }

      await this.updateFromStatus(form, runner);

      if (localRunner) await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Do action success!',
      };
    } catch (error) {
      if (localRunner) {
        await localRunner.rollbackTransaction();
        return {
          status: false,
          message: 'Do action Error: ' + error.message,
        };
      } else {
        throw new Error('Do action Error: ' + error.message);
      }
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async doactionUpdateFlow(flow: any, params: any, runner: QueryRunner) {
    // UPDATE APPROVAL STATUS
    let apvClause: string = '';
    params.stepNo = flow.CSTEPNO;
    if (flow.CAPVTYPE == this.APV_TYPE_SINGLE && flow.CAPPLYALL == '0') {
      apvClause = `and CSTEPNO = :stepNo`;
    } else if (
      flow.CAPVTYPE == this.APV_TYPE_SINGLE &&
      (flow.CAPPLYALL == this.APPLY_ALL_APV ||
        flow.CAPPLYALL == this.APPLY_ALL_REJ ||
        flow.CAPPLYALL == this.APPLY_ALL_BOTH)
    ) {
      apvClause = `and (CSTEPNO = :stepNo or (VAPVNO = :apv1 or VREPNO = :rep1))`;
      params = {
        ...params,
        apv1: params.VREALAPV,
        rep1: params.VREALAPV,
      };
    } else if (
      flow.CAPVTYPE == this.APV_TYPE_MULTIPLE_CO &&
      flow.CAPPLYALL == '0'
    ) {
      apvClause = `and ((VAPVNO = :apv1 or VREPNO = :rep1) and CSTEPNO = :stepNo)`;
      params = {
        ...params,
        apv1: params.VREALAPV,
        rep1: params.VREALAPV,
      };
    } else if (
      flow.CAPVTYPE == this.APV_TYPE_MULTIPLE_CO &&
      (flow.CAPPLYALL == this.APPLY_ALL_APV ||
        flow.CAPPLYALL == this.APPLY_ALL_BOTH)
    ) {
      apvClause = `and ((VAPVNO = :apv1 or VREPNO = :rep1) or (CSTEPNO = :stepNo and (VAPVNO = :apv2 or VREPNO = :rep2)))`;
      params = {
        ...params,
        apv1: params.VREALAPV,
        rep1: params.VREALAPV,
        apv2: params.VREALAPV,
        rep2: params.VREALAPV,
      };
    }
    const sql = `UPDATE FLOW SET CAPVSTNO = :whatAction, CSTEPST = :stepAction, DAPVDATE = TO_DATE(:DAPVDATE, 'YYYY-MM-DD'), CAPVTIME = :CAPVTIME, VREMARK = :VREMARK, VREMOTE = :VREMOTE, VREALAPV = :VREALAPV WHERE NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO AND CAPVSTNO = :CAPVSTNO ${apvClause}`;
    await this.updateFlowbySql(sql, params, runner);
  }

  async updateFlowbySql(
    sql: string,
    params: any,
    queryRunner?: QueryRunner,
    message?: string,
  ): Promise<{ status: boolean; updated?: number; message: string }> {
    let localRunner: QueryRunner | undefined;
    let msg = message || 'Update Flow ';
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const res = await runner.manager.query(sql, params);
      if (localRunner) await localRunner.commitTransaction();

      if (!res) {
        throw new Error('No rows updated');
      }
    } catch (error) {
      //   if (localRunner) await localRunner.rollbackTransaction();
      //   throw error;
      if (localRunner) {
        await localRunner.rollbackTransaction();
        return {
          status: false,
          message: msg + error.message,
        };
      } else {
        throw new Error(msg + error.message);
      }
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async getStepNext(form: FormDto, queryRunner?: QueryRunner) {
    const flowTree = (await this.getFlowTree(form, queryRunner)) ?? [];
    for (const step of flowTree) {
      if (step.CSTEPST == this.STEP_WAIT || step.CSTEPST == this.STEP_NORMAL) {
        return step.CSTEPNO;
      }
    }
    return '';
  }

  async updateFromStatus(form: FormDto, queryRunner?: QueryRunner) {
    let flowStatus: string = '';
    //FIND UNFINISH STEP
    if (!(await this.checkUnfinishedFlow(form, queryRunner))) {
      //FIND REJECT STEP
      const reject = await this.getFlow(
        {
          distinct: true,
          fields: ['CSTEPNO', 'VAPVNO', 'CAPVTYPE'],
          ...form,
          CAPVSTNO: this.APV_REJECT,
        },
        queryRunner,
      );
      if (reject.length == 0) {
        flowStatus = this.FLOW_APPROVE;
      } else {
        for (const step of reject) {
          if (step.CAPVTYPE == this.APV_TYPE_SINGLE) {
            flowStatus = this.FLOW_REJECT;
            break;
          } else {
            const stepApv = await this.getFlow({
              distinct: true,
              fields: ['CSTEPNO'],
              ...form,
              CSTEPNO: step.CSTEPNO,
              CAPVSTNO: this.APV_APPROVE,
            });
            if (stepApv.length > 0) {
              flowStatus = this.FLOW_REJECT;
              break;
            } else {
              flowStatus = this.FLOW_APPROVE;
            }
          }
        }
      }
      // UPDATE FLOW STATUS
      this.formService.updateForm({ condition: form, CST: flowStatus }, queryRunner);
    }
  }

  async checkUnfinishedFlow(
    form: FormDto,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const res = await this.getFlow(
      {
        ...form,
        CAPVSTNO: this.APV_NONE,
      },
      queryRunner,
    );
    return res.length > 0;
  }

  async updateSingleStep(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      'update flow set CAPVSTNO = :apvReject, CSTEPST = :stepSkip where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CAPVSTNO = :apvNone and CSTEPST in (:stepNormal, :stepWait, :stepReady)';
    const params = {
      ...form,
      apvReject: this.APV_REJECT,
      stepSkip: this.STEP_SKIP,
      apvNone: this.APV_NONE,
      stepNormal: this.STEP_NORMAL,
      stepWait: this.STEP_WAIT,
      stepReady: this.STEP_READY,
    };
    await this.updateFlowbySql(sql, params, queryRunner, 'Update Single Step');
  }

  async updateStepNextStatus(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      'update flow set CAPVSTNO = :apvNone, CSTEPST = :stepReady where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO AND CSTEPNO = :stepNext AND CSTEPST in (:stepNormal, :stepWait) ';
    const params = {
      ...form,
      apvNone: this.APV_NONE,
      stepReady: this.STEP_READY,
      stepNext: await this.getStepNext(form, queryRunner),
      stepNormal: this.STEP_NORMAL,
      stepWait: this.STEP_WAIT,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Step Next Status',
    );
  }

  async updateNextStepWait(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      'update flow set CAPVSTNO = :apvNone, CSTEPST = :stepWait where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPNO in (select cStepNextNo from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and CSTEPNO = :stepNext) and CSTEPST = :stepNormal and CAPVSTNO = :apvNone2';
    const params = {
      ...form,
      frm: form.NFRMNO,
      org: form.VORGNO,
      y: form.CYEAR,
      y2: form.CYEAR2,
      runno: form.NRUNNO,
      apvNone: this.APV_NONE,
      apvNone2: this.APV_NONE,
      stepWait: this.STEP_WAIT,
      stepNormal: this.STEP_NORMAL,
      stepNext: await this.getStepNext(form, queryRunner),
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Next Step Wait',
    );
  }

  async updateStepWaitToNormal(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      "update flow set CSTEPST = :stepNormal, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPST = :stepWait ";
    const params = {
      ...form,
      stepNormal: this.STEP_NORMAL,
      apvNone: this.APV_NONE,
      stepWait: this.STEP_WAIT,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Step Wait To Step Normal',
    );
  }

  async updateStepReadyToWait(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      "update flow set CSTEPST = :stepWait, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPST = :stepReady ";
    const params = {
      ...form,
      stepWait: this.STEP_WAIT,
      apvNone: this.APV_NONE,
      stepReady: this.STEP_READY,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Step Ready To Step Wait',
    );
  }

  async updateStepReqToReady(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      "update flow set CSTEPST = :stepReady, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and cStart = '1' ";
    const params = {
      ...form,
      stepReady: this.STEP_READY,
      apvNone: this.APV_NONE,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Step Request To Step Ready',
    );
  }

  async updateStepReqToReadyB(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      "update flow set CSTEPST = :stepReady, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and cstepnextno in (select cstepno from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and cstepst = :stepWait)";
    const params = {
      ...form,
      frm: form.NFRMNO,
      org: form.VORGNO,
      y: form.CYEAR,
      y2: form.CYEAR2,
      runno: form.NRUNNO,
      stepReady: this.STEP_READY,
      apvNone: this.APV_NONE,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Step Request To Step Ready(Returnb)',
    );
  }

  async updateAllStepToNormal(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      "update flow set CSTEPST = :stepNormal, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and cStart <> '1' ";
    const params = {
      ...form,
      stepNormal: this.STEP_NORMAL,
      apvNone: this.APV_NONE,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update All Step To Step Normal',
    );
  }

  async updateStepReqNextToWait(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      "update flow set CSTEPST = :stepWait, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPNO = (select CSTEPNEXTNO from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and CSTART = '1')";
    const params = {
      ...form,
      frm: form.NFRMNO,
      org: form.VORGNO,
      y: form.CYEAR,
      y2: form.CYEAR2,
      runno: form.NRUNNO,
      stepWait: this.STEP_WAIT,
      apvNone: this.APV_NONE,
    };
    return await this.updateFlowbySql(
      sql,
      params,
      queryRunner,
      'Update Step Request Next To Step Wait',
    );
  }

  //------------------------------- Do action End ---------------------------------
}
