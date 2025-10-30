import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TwidocService } from './twidoc.service';
import { MasterkeyService } from '../masterkey/masterkey.service';

@Controller('hradmin/twidoc')
export class TwidocController {
  constructor(
    private readonly docs: TwidocService,
    private keys: MasterkeyService,
  ) {}

  @Post('all')
  @UseGuards(AuthGuard('key'))
  async findAll(@Request() req, @Body() body: any) {
    const data = await this.docs.findAll(req.user.user, body);
    return data.map((item) => {
      const { TWIINCOME, TWITAX, TWIPVF, TWISSO, ...rest } = item;
      return rest;
    });
  }

  //   @Post('id')
  //   @UseGuards(AuthGuard('key'))
  //   findById(@Request() req, @Body() body: any) {
  //     return this.docs.findById(req.user.user, body);
  //   }

  @Post('adjust')
  @UseGuards(AuthGuard('key'))
  adjust(@Request() req, @Body() body: any) {
    return this.docs.adjust(req.user.user, body);
  }

  @Post('create-pdf')
  @UseGuards(AuthGuard('key'))
  async createPdf(@Request() req, @Body() body: any) {
    const data = await this.docs.findById(req.user.user, body);
    const key = await this.keys.decrypt(req.user.user);
    const pdfkey = key.split(':')[3];
    let passkey = pdfkey;
    if (data.EMPPOSITION !== 'MP')
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
