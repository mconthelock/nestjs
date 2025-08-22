import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { Flow } from './entities/flow.entity';

import { SearchFlowDto } from './dto/search-flow.dto';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

import { RepService } from '../rep/rep.service';
import { FormService } from '../form/form.service';
import { checkHostTest } from 'src/common/helpers/repo.helper';
import {
  getBase64Image,
  getBase64ImageFromUrl,
  joinPaths,
} from 'src/common/utils/files.utils';
import { formatDate } from 'src/common/utils/dayjs.utils';
import { empnoFormDto } from '../form/dto/empno-form.dto';
import { FormDto } from '../form/dto/form.dto';

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
    return repo.find({
      where: dto,
    });
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
}
