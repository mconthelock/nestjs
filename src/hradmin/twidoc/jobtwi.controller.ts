import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/job.strategy';
import { TwidocService } from './twidoc.service';
import { MasterkeyService } from '../masterkey/masterkey.service';
import { Masterkey } from '../masterkey/entities/masterkey.entity';

@Controller('hradmin/job/twi')
@UseGuards(ApiKeyGuard)
export class JobTwiController {
  constructor(
    private readonly docs: TwidocService,
    private readonly keys: MasterkeyService,
  ) {}

  //   @Post('run-twidoc-report')
  //   async runTwiReport(@Body() body: any) {
  //     const keys = await this.keys.findAll();
  //     const key = keys.find((k: Masterkey) => k.KEY_OWNER === 'DUMMY')?.KEY_CODE;
  //     const data = await this.docs.findAll(key, {
  //       year: body.year,
  //       type: body.type,
  //     });
  //     return data;
  //   }

  //   @Post('run-twidoc-report-emp')
  //   async runTwiReportEmp(@Body() body: any) {
  //     const keys = await this.keys.findAll();
  //     const key = keys.find((k: Masterkey) => k.KEY_OWNER === 'DUMMY')?.KEY_CODE;
  //     const data = await this.docs.findById(key, {
  //       year: body.year,
  //       empno: body.empno,
  //     });
  //     return data;
  //   }
}
