import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwidocService } from './twidoc.service';

@Controller('hradmin/twidoc')
export class TwidocController {
  constructor(private readonly docs: TwidocService) {}

  @Post('all')
  @UseGuards(AuthGuard('key'))
  findAll(@Request() req, @Body() body: any) {
    return this.docs.findAll(req.user.user, body);
  }

  @Post('id')
  @UseGuards(AuthGuard('key'))
  findById(@Request() req, @Body() body: any) {
    return this.docs.findById(req.user.user, body);
  }

  @Post('adjust')
  @UseGuards(AuthGuard('key'))
  adjust(@Request() req, @Body() body: any) {
    return this.docs.adjust(req.user.user, body);
  }

  @Post('create-pdf')
  @UseGuards(AuthGuard('key'))
  async createPdf(@Request() req, @Body() body: any) {
    const data = await this.docs.findById(req.user.user, body);
    this.docs.createFile(data);
    return null;
  }
}
