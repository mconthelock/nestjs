import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/job.strategy';
import { PromoteService } from './promote.service';
import { MasterkeyService } from '../masterkey/masterkey.service';
import { DatabaseService } from '../shared/database.service';
import { Masterkey } from '../masterkey/entities/masterkey.entity';

@Controller('hradmin/job/promote')
@UseGuards(ApiKeyGuard)
export class JobpromoteController {
  constructor(
    private readonly docs: PromoteService,
    private readonly keys: MasterkeyService,
    private readonly dbService: DatabaseService,
  ) {}

  @Post('run-promotedoc-file')
  async runTwiReport(@Body() body: any) {
    const keys = await this.keys.findAll();
    const key = keys.find((k: Masterkey) => k.KEY_OWNER === 'DUMMY')?.KEY_CODE;
    const apskey = await this.dbService.decrypt(key);
    const pdfkey = apskey.split(':')[5];
    let passkey = pdfkey;
    if (body.type !== 'MP')
      passkey = `${pdfkey.substring(4, 8)}${pdfkey.substring(0, 4)}`;

    const data = await this.docs.findAll(key, {
      year: body.year,
      type: body.type,
      cycle: body.cycle,
    });
    const results = [];
    for (const item of data) {
      const res = await this.docs.createFile({ ...item, passkey });
      results.push(res);
    }
    return results;
  }
}
