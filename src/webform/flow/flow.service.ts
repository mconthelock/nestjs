import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, In } from 'typeorm';

import { Flow } from './entities/flow.entity';

import { SearchFlowDto } from './dto/search-flow.dto';
import { CreateFlowDto } from './dto/create-flow.dto';
import { DeleteFlowStepDto, UpdateFlowDto } from './dto/update-flow.dto';
import { empnoFormDto } from '../form/dto/empno-form.dto';
import { FormDto } from '../form/dto/form.dto';
import { doactionFlowDto } from './dto/doaction-flow.dto';

import { RepService } from '../rep/rep.service';
import { FormService } from '../form/form.service';
import { FormmstService } from '../formmst/formmst.service';
import { UsersService } from 'src/amec/users/users.service';
import { checkHostTest } from 'src/common/helpers/repo.helper';

import { getBase64ImageFromUrl } from 'src/common/utils/files.utils';
import { formatDate, now } from 'src/common/utils/dayjs.utils';
import { getSafeFields } from 'src/common/utils/Fields.utils';
import { showFlowDto } from './dto/show-flow.dto';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow, 'webformConnection')
    private readonly flowRepo: Repository<Flow>,

    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private readonly repService: RepService,
    @Inject(forwardRef(() => FormService))
    private readonly formService: FormService,
    private readonly usersService: UsersService,
    private readonly formmstService: FormmstService,
    private readonly mailService: MailService,
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
      return true;
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new Error('Insert flow Error: ' + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  getFlow(dto: SearchFlowDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Flow)
      : this.flowRepo;
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

      if (data.VAPVNO && !data.VREPNO) {
        data.VREPNO = await this.repService.getRepresent(
          {
            NFRMNO: condition.NFRMNO,
            VORGNO: condition.VORGNO,
            CYEAR: condition.CYEAR,
            VEMPNO: data.VAPVNO,
          },
          runner,
        );
      }

      // await queryRunner.manager.save(repo.target, dto);
      await runner.manager.getRepository(Flow).update(condition, data);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new Error('Update flow Error: ' + error.message);
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
      if (localRunner) await localRunner.rollbackTransaction();
      throw new Error('Re-align flow Error: ' + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async deleteFlow(
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
      await runner.manager.getRepository(Flow).delete(dto);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new Error('Delete flow Error: ' + error.message);
      //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async deleteFlowStep(
    dto: DeleteFlowStepDto,
    queryRunner?: QueryRunner,
  ): Promise<{ status: boolean; message: string }> {
    let localRunner: QueryRunner | undefined;
    let didConnect = false;
    let didStartTx = false;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        didConnect = true;
        await localRunner.startTransaction();
        didStartTx = true;
      }
      const runner = queryRunner || localRunner!;

      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      };

      var flowStart = false;

      const flow = await this.getFlow(
        { ...form, CSTEPNO: dto.CSTEPNO },
        runner,
      );
      if (flow.length === 0) {
        // throw new Error('Flow step not found');
        return {
          status: false,
          message: 'Flow step not found',
        };
      }

      // prettier-ignore
      for (const step of flow) {
        if (step.CSTART == '1') {
          flowStart = true;
        }
        // Update previous step
        await this.updateFlow(
          { condition: {...form, CSTEPNEXTNO: step.CSTEPNO}, CSTEPNEXTNO: step.CSTEPNEXTNO },
          runner,
        );
        // Update start step
        if (flowStart) {
          await this.updateFlow(
            { condition: {...form, CSTEPNO: step.CSTEPNEXTNO}, CSTART: '1' },
            runner,
          );
        }
        // Update next step
        const stepReady = await this.getFlow({...form, CSTEPST: this.STEP_READY}, runner);
        await this.updateFlow(
            { condition: {...form, CSTEPNO: stepReady[0].CSTEPNEXTNO}, CSTEPST: '2' },
            runner,
        );
        const condition = {
            ...form,
            CSTEPNO: step.CSTEPNO,
        }
        await this.deleteFlow(condition, runner);
      }

      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Delete Flow Step Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete Flow Step Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  //---------------------------- Show flow Start --------------------------------

  async showFlow(dto: showFlowDto, queryRunner?: QueryRunner) {
    const form = {
      NFRMNO: dto.NFRMNO,
      VORGNO: dto.VORGNO,
      CYEAR: dto.CYEAR,
      CYEAR2: dto.CYEAR2,
      NRUNNO: dto.NRUNNO,
    };
    const flowData = await this.getFlowTree(form, queryRunner);
    if (flowData.length === 0) {
      throw new Error('Flow data not found');
    }
    const html = await this.generateHtml(flowData, dto);
    return {
      status: true,
      html: html,
      data: flowData,
    };
  }

  async getFlowTree(form: FormDto, queryRunner?: QueryRunner) {
    const dataSource = queryRunner ? queryRunner : this.dataSource;
    const sql = `
    SELECT DISTINCT LEVEL, CSTEPNO, CSTEPNEXTNO, CSTEPST, CEXTDATA, VAPVNO, SRECMAIL, NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, SNAME, VNAME, DAPVDATE, CAPVTIME, VREMARK,  VREPNO, VREALAPV
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

    //   const sql =
    //     `SELECT DISTINCT LV, TO_CHAR(this.APPLY_ALL_APV.NFRMNO) AS NFRMNO2, TO_CHAR(this.APPLY_ALL_APV.NRUNNO) AS NRUNNO2, A.*, SNAME, SPOSITION, VNAME, CST
    //     FROM FORM F
    //     JOIN (
    //         SELECT DISTINCT LEVEL AS LV, FLOW.*
    //         FROM FLOW
    //         START WITH
    //             NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno AND CSTART = '1'
    //         CONNECT BY
    //             NFRMNO = :frm2 and VORGNO = :org2 AND CYEAR = :cyear AND CYEAR2 = :cyear2 AND NRUNNO = :runno2 AND CSTEPNO = PRIOR CSTEPNEXTNO
    //     ) A ON F.NFRMNO = A.NFRMNO AND F.VORGNO = A.VORGNO AND F.CYEAR = A.CYEAR AND F.CYEAR2 = A.CYEAR2 AND F.NRUNNO = A.NRUNNO
    //     JOIN AMEC.AEMPLOYEE E ON E.SEAMPNO = A.VAPVNO
    //     JOIN AMEC.PPOSITION P ON P.SPOSCODE = E.SPOCODE
    //     JOIN STEPMST S ON A.CSTEPNO = S.CNO
    //     ORDER BY A.LV
    //     `;
    //   const params = {
    //     ...form,
    //     frm: form.NFRMNO,
    //     org: form.VORGNO,
    //     y: form.CYEAR,
    //     y2: form.CYEAR2,
    //     runno: form.NRUNNO,
    //     frm2: form.NFRMNO,
    //     org2: form.VORGNO,
    //     cyear: form.CYEAR,
    //     cyear2: form.CYEAR2,
    //     runno2: form.NRUNNO,
    //   };
    //   await this.execSql(
    //     sql,
    //     params,
    //     queryRunner,
    //     'Reset flow',
    //   );
  }

  async generateHtml(flowData: any, form: showFlowDto) {
    const webflow = checkHostTest(process.env.STATE)
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
    const showStep = form.showStep ? '' : 'display:none;';

    let html = `
    <div style="display:flex; overflow:auto;">
        <div style="margin-left:auto; margin-right:auto;">
        <table style="width: 100%; padding:15px; border:solid 1px #000;  margin-left: auto; margin-right: auto; border-collapse: collapse;font-size: 0.8rem;">
            <thead style="background: #aaccee; color: #323232;">
                <th colspan="7" style="text-align:center; padding:5px">Flow</th>
            </thead>
            <tbody style="background: #fffff0; color: #626262;">
            <tr>
                <th style="border: 1px solid blue; padding: 5px 8px;"></th>
                <th style="border: 1px solid blue; padding: 5px 8px; ${showStep}">Step</th>
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
          '<button type="button" style="background-color:#efefef; padding:3px; border:solid 1px #767676; border-radius:5px; color:#000;"  onclick="javascript:var winRem = window.open(\'' +
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
            <td style="border: 1px solid blue;">${ status[step.CSTEPST] != '' ? `<img style="width:23px;"  src="${status[step.CSTEPST]}"/>` : ''}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap; ${showStep}">${step.VNAME}</td>
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
    const flow = await this.getEmpFlowStepReady(dto);
    if (flow.length === 0 || dto.EMPNO == null || dto.EMPNO == '') {
      return '';
    }
    return flow[0].CEXTDATA;
  }
  //------------------------------ Reset flow Start ------------------------------

  async resetFlow(form: FormDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    let didConnect = false;
    let didStartTx = false;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        didConnect = true;
        await localRunner.startTransaction();
        didStartTx = true;
      }
      const runner = queryRunner || localRunner!;

      const flowtree = await this.getFlowTree(form, runner);

      if (flowtree.length === 0) {
        throw new Error('Flow data not found');
      }

      let updated = true;
      while (updated) {
        updated = false;
        const flowtree = await this.getFlowTree(form, runner);
        for (let i = 0; i < flowtree.length - 1; i++) {
          const currStep = flowtree[i];
          const nextStep = flowtree[i + 1];
          // STEP_APPROVE = '5', STEP_READY = '3', STEP_REJECT = '6', STEP_SKIP = '7', STEP_NORMAL = '1', STEP_WAIT = '2'
          if (
            currStep.CSTEPST == this.STEP_APPROVE &&
            nextStep.CSTEPST != this.STEP_READY &&
            nextStep.CSTEPST != this.STEP_REJECT &&
            nextStep.CSTEPST != this.STEP_SKIP &&
            nextStep.CSTEPST != this.STEP_APPROVE
          ) {
            await this.updateFlow(
              {
                condition: {
                  NFRMNO: form.NFRMNO,
                  VORGNO: form.VORGNO,
                  CYEAR: form.CYEAR,
                  CYEAR2: form.CYEAR2,
                  NRUNNO: form.NRUNNO,
                  CSTEPNO: nextStep.CSTEPNO,
                },
                CSTEPST: this.STEP_READY,
              },
              runner,
            );
            updated = true;
          }
          if (
            currStep.CSTEPST == this.STEP_READY &&
            nextStep.CSTEPST != this.STEP_WAIT &&
            nextStep.CSTEPST != this.STEP_REJECT &&
            nextStep.CSTEPST != this.STEP_SKIP &&
            nextStep.CSTEPST != this.STEP_APPROVE
          ) {
            await this.updateFlow(
              {
                condition: {
                  NFRMNO: form.NFRMNO,
                  VORGNO: form.VORGNO,
                  CYEAR: form.CYEAR,
                  CYEAR2: form.CYEAR2,
                  NRUNNO: form.NRUNNO,
                  CSTEPNO: nextStep.CSTEPNO,
                },
                CSTEPST: this.STEP_WAIT,
              },
              runner,
            );
            updated = true;
          }
          if (
            currStep.CSTEPST == this.STEP_WAIT &&
            nextStep.CSTEPST != this.STEP_NORMAL &&
            nextStep.CSTEPST != this.STEP_REJECT &&
            nextStep.CSTEPST != this.STEP_SKIP &&
            nextStep.CSTEPST != this.STEP_APPROVE
          ) {
            await this.updateFlow(
              {
                condition: {
                  NFRMNO: form.NFRMNO,
                  VORGNO: form.VORGNO,
                  CYEAR: form.CYEAR,
                  CYEAR2: form.CYEAR2,
                  NRUNNO: form.NRUNNO,
                  CSTEPNO: nextStep.CSTEPNO,
                },
                CSTEPST: this.STEP_NORMAL,
              },
              runner,
            );
            updated = true;
          }
          if (
            currStep.CSTEPST == this.STEP_NORMAL &&
            nextStep.CSTEPST != this.STEP_NORMAL &&
            nextStep.CSTEPST != this.STEP_REJECT &&
            nextStep.CSTEPST != this.STEP_SKIP &&
            nextStep.CSTEPST != this.STEP_APPROVE
          ) {
            await this.updateFlow(
              {
                condition: {
                  NFRMNO: form.NFRMNO,
                  VORGNO: form.VORGNO,
                  CYEAR: form.CYEAR,
                  CYEAR2: form.CYEAR2,
                  NRUNNO: form.NRUNNO,
                  CSTEPNO: nextStep.CSTEPNO,
                },
                CSTEPST: this.STEP_NORMAL,
              },
              runner,
            );
            updated = true;
          }
        }
      }

      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Reset flow Successfully',
        data: await this.getFlowTree(form, runner),
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Reset flow Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  // ------------------------------ Reset flow End ------------------------------

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
        CAPVTIME: now('HH:mm:ss'),
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
            const stepNext:
              | ''
              | {
                  stepno: string;
                  stepNextNo: string;
                } = await this.getStepNext(form, runner);
            if (!stepNext) break;
            //UPDATE STEP NEXT STATUS
            await this.updateStepNextStatus(form, stepNext.stepno, runner);
            //UPDATE NEXT NEXT STEP (WAIT)
            if (stepNext.stepNextNo != '00') {
              await this.updateNextStepWait(form, stepNext.stepno, runner);
            }
            await this.sendMailToApprover(form, runner); // send email to approver
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
          const stepNext:
            | ''
            | {
                stepno: string;
                stepNextNo: string;
              } = await this.getStepNext(form, runner);
          if (!stepNext) break;
          //Start updating flow status
          if (updateFlow) {
            //UPDATE SINGLE STEP
            await this.updateSingleStep(form, runner);
          } else {
            //UPDATE STEP NEXT STATUS
            await this.updateStepNextStatus(form, stepNext.stepno, runner);
            //UPDATE NEXT NEXT STEP (WAIT)
            if (stepNext.stepNextNo != '00') {
              await this.updateNextStepWait(form, stepNext.stepno, runner);
            }
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
        case 'returnE':
          if (!dto.CEXTDATA) {
            throw new Error('CEXTDATA is required for returnE action');
          }
          whatAction = this.APV_NONE;
          stepAction = this.STEP_READY;
          await this.doactionUpdateFlow(
            flow,
            { ...params, whatAction, stepAction },
            runner,
          );
          await this.updateStepNextExeToNormal(form, dto.CEXTDATA, runner); // step ต่อจาก exe ทั้งหมดเป็น 1
          await this.updateStepExeToReady(form, dto.CEXTDATA, runner); // step ที่ exe เป็น 3
          await this.updateStepNextExeToWait(form, dto.CEXTDATA, runner); // step ต่อจาก exe เป็น 2
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
      }
      throw new Error('Do action Error: ' + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async doactionUpdateFlow(flow: any, params: any, runner: QueryRunner) {
    // UPDATE APPROVAL STATUS
    let apvClause: string = '';
    params.stepNo = flow.CSTEPNO;
    if (flow.CAPVTYPE == this.APV_TYPE_SINGLE && flow.CAPPLYALL == this.APPLY_ALL_NONE) {
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
      flow.CAPPLYALL == this.APPLY_ALL_NONE
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
    await this.execSql(sql, params, runner);
  }

  async execSql(
    sql: string,
    params: any,
    queryRunner?: QueryRunner,
    message?: string,
  ): Promise<{ status: boolean; result?: any; message: string }> {
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
        throw new Error(', No rows updated');
      } else {
        return { status: true, result: res, message: msg + 'success' };
      }
    } catch (error) {
      if (localRunner) {
        await localRunner.rollbackTransaction();
      }
      throw new Error(msg + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async getStepNext(form: FormDto, queryRunner?: QueryRunner) {
    const flowTree = (await this.getFlowTree(form, queryRunner)) ?? [];
    for (const step of flowTree) {
      if (step.CSTEPST == this.STEP_WAIT || step.CSTEPST == this.STEP_NORMAL) {
        return { stepno: step.CSTEPNO, stepNextNo: step.CSTEPNEXTNO };
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
            const stepApv = await this.getFlow(
              {
                distinct: true,
                fields: ['CSTEPNO'],
                ...form,
                CSTEPNO: step.CSTEPNO,
                CAPVSTNO: this.APV_APPROVE,
              },
              queryRunner,
            );
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
      await this.formService.updateForm(
        { condition: form, CST: flowStatus },
        queryRunner,
      );
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
    return await this.execSql(sql, params, queryRunner, 'Update Single Step');
  }

  async updateStepNextStatus(
    form: FormDto,
    stepNext: string,
    queryRunner?: QueryRunner,
  ) {
    const sql =
      'update flow set CAPVSTNO = :apvNone, CSTEPST = :stepReady where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO AND CSTEPNO = :stepNext AND CSTEPST in (:stepNormal, :stepWait) ';
    const params = {
      ...form,
      apvNone: this.APV_NONE,
      stepReady: this.STEP_READY,
      stepNext: stepNext,
      stepNormal: this.STEP_NORMAL,
      stepWait: this.STEP_WAIT,
    };
    return await this.execSql(
      sql,
      params,
      queryRunner,
      'Update Step Next Status',
    );
  }

  async updateNextStepWait(
    form: FormDto,
    stepNext: string,
    queryRunner?: QueryRunner,
  ) {
    const check = await queryRunner.manager.query(
      'select * from flow where NFRMNO = :1 AND VORGNO = :2 AND CYEAR = :3 AND CYEAR2 = :4 AND NRUNNO = :5 and CSTEPNO in (select cStepNextNo from flow where NFRMNO = :6 AND VORGNO = :7 AND CYEAR = :8 AND CYEAR2 = :9 AND NRUNNO = :10 and CSTEPNO = :11) and CSTEPST = :12 and CAPVSTNO = :13',
      [
        form.NFRMNO,
        form.VORGNO,
        form.CYEAR,
        form.CYEAR2,
        form.NRUNNO,
        form.NFRMNO,
        form.VORGNO,
        form.CYEAR,
        form.CYEAR2,
        form.NRUNNO,
        stepNext,
        this.STEP_NORMAL,
        this.APV_NONE,
      ],
    );
    if (check.length == 0) {
      return;
    }

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
      stepNext: stepNext,
    };
    return await this.execSql(
      sql,
      params,
      queryRunner,
      'Update Next Step Wait',
    );
  }

  async updateStepWaitToNormal(form: FormDto, queryRunner?: QueryRunner) {
    const stepWait = this.getFlow(
      { ...form, CSTEPST: this.STEP_WAIT },
      queryRunner,
    );
    if ((await stepWait).length == 0) {
      return;
    }
    const sql =
      "update flow set CSTEPST = :stepNormal, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPST = :stepWait ";
    const params = {
      ...form,
      stepNormal: this.STEP_NORMAL,
      apvNone: this.APV_NONE,
      stepWait: this.STEP_WAIT,
    };
    return await this.execSql(
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
    return await this.execSql(
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
    return await this.execSql(
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
      stepWait: this.STEP_WAIT,
    };
    return await this.execSql(
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
    return await this.execSql(
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
    return await this.execSql(
      sql,
      params,
      queryRunner,
      'Update Step Request Next To Step Wait',
    );
  }

  async updateStepExeToReady(
    form: FormDto,
    cextdata: string,
    queryRunner?: QueryRunner,
  ) {
    const sql =
      "update flow set CSTEPST = :stepReady, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CEXTDATA = :cextdata";

    const params = {
      ...form,
      cextdata: cextdata,
      stepReady: this.STEP_READY,
      apvNone: this.APV_NONE,
    };

    return await this.execSql(
      sql,
      params,
      queryRunner,
      'Update Step Exedata To Step Ready(ReturnE)',
    );
  }

  async updateStepNextExeToNormal(
    form: FormDto,
    cextdata: string,
    queryRunner?: QueryRunner,
  ) {
    const sql =
      "UPDATE FLOW f SET f.CSTEPST = :stepNormal, f.VREALAPV = '', f.CAPVSTNO = :apvNone, f.DAPVDATE = '', f.CAPVTIME = '' WHERE (f.NFRMNO, f.VORGNO, f.CYEAR, f.CYEAR2, f.NRUNNO, f.CSTEPNO, f.CEXTDATA) IN (SELECT NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, CSTEPNO, CEXTDATA FROM FLOW START WITH  CEXTDATA = :cextdata AND NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO CONNECT BY NFRMNO = PRIOR NFRMNO AND VORGNO = PRIOR VORGNO AND CYEAR = PRIOR CYEAR AND CYEAR2 = PRIOR CYEAR2 AND NRUNNO = PRIOR NRUNNO AND CSTEPNO = PRIOR CSTEPNEXTNO)";
    const params = {
      ...form,
      cextdata: cextdata,
      stepNormal: this.STEP_NORMAL,
      apvNone: this.APV_NONE,
    };

    return await this.execSql(
      sql,
      params,
      queryRunner,
      'Update Step Next Exe To Step Normal',
    );
  }

  async updateStepNextExeToWait(
    form: FormDto,
    cextdata: string,
    queryRunner?: QueryRunner,
  ) {
    const sql =
      "UPDATE FLOW f SET f.CSTEPST = :stepWait, f.VREALAPV = '', f.CAPVSTNO = :apvNone, f.DAPVDATE = '', f.CAPVTIME = '' WHERE NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPNO = (select CSTEPNEXTNO from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and CEXTDATA = :cextdata)";
    const params = {
      ...form,
      frm: form.NFRMNO,
      org: form.VORGNO,
      y: form.CYEAR,
      y2: form.CYEAR2,
      runno: form.NRUNNO,
      cextdata: cextdata,
      stepWait: this.STEP_WAIT,
      apvNone: this.APV_NONE,
    };
    return await this.execSql(
      sql,
      params,
      queryRunner,
      'Update Step Next Exe To Step Wait',
    );
  }

  async sendMailToApprover(form: FormDto, queryRunner?: QueryRunner) {
    const res = await this.getNameReq(form, queryRunner);
    if (res.result.length > 0) {
      const req = res.result[0];
      const frmmst = await this.formmstService.getFormmst(
        { NNO: form.NFRMNO, VORGNO: form.VORGNO, CYEAR: form.CYEAR },
        queryRunner,
      );
      const formNumber = await this.formService.getFormno(form, queryRunner);
      const subject = `E-Form ${formNumber} from ${req.SNAME}`;
      const listApv = await this.getEmailApvNext(form, queryRunner);
      let html = `Please approve/reject ${frmmst[0].VNAME} From:${req.SNAME}<br/>`;
      html += '1. Get into http://webflow/form<br/>';
      html += "2. select 'Electronic forms'<br/>";
      html += "3. select 'Waiting for approval'<br/>";
      if (listApv.result.length > 0) {
        for (const list of listApv.result) {
          this.mailService.sendMail({
            from: 'webflow_admin@MitsubishiElevatorAsia.co.th',
            to: list.VEMAIL,
            // to: process.env.MAIL_ADMIN,
            subject,
            html,
          });
        }
      }
    }
  }

  async getNameReq(form: FormDto, queryRunner?: QueryRunner) {
    const sql =
      'select a.SNAME as SNAME , a.SRECMAIL as SRECMAIL from form f , amecuserall a where a.SEMPNO = f.VREQNO and NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO';
    return await this.execSql(sql, form, queryRunner);
  }

  async getEmailApvNext(form: FormDto, queryRunner?: QueryRunner) {
    const sql = `select distinct VEMAIL from emailAck where NFRMNO = :NFRMNO and VORGNO = :VORGNO and CYEAR = :CYEAR and VEMPNO in (select VAPVNO as APPROVER from flow where NFRMNO = :frmno and VORGNO = :orgno and CYEAR = :y and CYEAR2 = :y2 and NRUNNO = :runno and CSTEPST = '3' union select VREPNO from flow where NFRMNO = :frmno2 and VORGNO = :orgno2 and CYEAR = :cy and CYEAR2 = :cy2 and NRUNNO = :runno2 and CSTEPST = '3') and CSTNO = '1'`;
    const params = {
      NFRMNO: form.NFRMNO,
      VORGNO: form.VORGNO,
      CYEAR: form.CYEAR,
      frmno: form.NFRMNO,
      orgno: form.VORGNO,
      y: form.CYEAR,
      y2: form.CYEAR2,
      runno: form.NRUNNO,
      frmno2: form.NFRMNO,
      orgno2: form.VORGNO,
      cy: form.CYEAR,
      cy2: form.CYEAR2,
      runno2: form.NRUNNO,
    };
    return await this.execSql(sql, params, queryRunner);
  }
  //------------------------------- Do action End ---------------------------------
}
