import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { Flow } from './entities/flow.entity';

import { getExtDataDto } from './dto/get-Extdata.dto';
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

interface form {
  NFRMNO: number;
  VORGNO: string;
  CYEAR: string;
  CYEAR2: string;
  NRUNNO: number;
}

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
  private readonly STEP_READY = '3';

  private readonly prepare = '0';
  private readonly onGoing = '1';
  private readonly running = '1';
  private readonly approve = '2';
  private readonly reject = '3';

  getExtData(dto: getExtDataDto) {
    const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, APV } = dto;

    return this.flowRepo
      .createQueryBuilder('f')
      .select('CEXTDATA')
      .where('f.NFRMNO = :NFRMNO', { NFRMNO })
      .andWhere('f.VORGNO = :VORGNO', { VORGNO })
      .andWhere('f.CYEAR = :CYEAR', { CYEAR })
      .andWhere('f.CYEAR2 = :CYEAR2', { CYEAR2 })
      .andWhere('f.NRUNNO = :NRUNNO', { NRUNNO })
      .andWhere('(f.VAPVNO = :APV OR f.VREPNO = :REP)', { APV, REP: APV })
      .andWhere('f.CSTEPST = :STEP_READY', { STEP_READY: '3' })
      .getRawMany();
  }

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

  async showFlow(form: form, host: string, queryRunner?: QueryRunner) {
    const flowData = await this.getFlowTree(form, queryRunner);
    const html = await this.generateHtml(flowData, form, host);
    return {
      status: true,
      html: html,
      data: flowData,
    };
  }

  async getFlowTree(form: form, queryRunner?: QueryRunner) {
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

  async generateHtml(flowData: any, form: form, host: string) {
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

  async getFlowStatusName(form: form) {
    const formcst = await this.formService.getCst(form);
    const status = formcst.CST;
    console.log('status : ', status);

    let html = '';
    const msg = '<font color="#000000">Status: </font>';
    switch (status) {
      case this.running:
        html =
          msg +
          '&nbsp;<font color="#' +
          this.flowStatusColor(status) +
          '">Running</font>';
        break;
      case this.approve:
        html =
          msg +
          '&nbsp;<font color="#' +
          this.flowStatusColor(status) +
          '">Approve</font>';
        break;
      case this.reject:
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
      case this.running:
        color = '0000FF';
        break;
      case this.reject:
        color = 'FF0000';
        break;
      case this.approve:
        color = '009900';
        break;
    }
    return color;
  }
}
