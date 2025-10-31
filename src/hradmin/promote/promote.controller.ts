import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PromoteService } from './promote.service';
import { AuthGuard } from '@nestjs/passport';
import { MasterkeyService } from '../masterkey/masterkey.service';
import { DatabaseService } from '../shared/database.service';

@Controller('hradmin/promote')
export class PromoteController {
  constructor(
    private readonly docs: PromoteService,
    private keys: MasterkeyService,
    private dbService: DatabaseService,
  ) {}

  @Post('all')
  @UseGuards(AuthGuard('key'))
  async findAll(@Request() req, @Body() body: any) {
    const data = await this.docs.findAll(req.user.user, body);
    return data.map((item) => {
      const {
        OLDPOSITION,
        NEWPOSITION,
        OLDLEVEL,
        NEWLEVEL,
        OLDSALARY,
        NEWSALARY,
        OLDJOBAW,
        NEWJOBAW,
        OLDEXAW,
        NEWEXAW,
        OLDSPAW,
        NEWSPAW,
        ...rest
      } = item;
      return rest;
    });
  }

  //   @Post('id')
  //   @UseGuards(AuthGuard('key'))
  //   findById(@Request() req, @Body() body: any) {
  //     return this.docs.findById(req.user.user, body);
  //   }

  @Post('create-pdf')
  @UseGuards(AuthGuard('key'))
  async createPdf(@Request() req, @Body() body: any) {
    const data = await this.docs.findById(req.user.user, body);
    const key = await this.dbService.decrypt(req.user.user);
    const pdfkey = key.split(':')[3];
    let passkey = pdfkey;
    if (data.ASETYP !== 'MP')
      passkey = `${pdfkey.substring(4, 8)}${pdfkey.substring(0, 4)}`;
    return this.docs.createFile({ ...data, passkey });
  }

  @Post('export-excel')
  @UseGuards(AuthGuard('key'))
  async exportExcel(@Request() req, @Body() body: any, @Res() res: Response) {
    const data = await this.docs.findAll(req.user.user, body);
    const buffer = await this.docs.createExcel(data);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.send(Buffer.from(buffer));
  }
}
