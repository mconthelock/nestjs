import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { FormmstService } from './formmst.service';
import { SearchDto } from './dto/search.dto';

@Controller('formmst')
export class FormmstController {
  constructor(private readonly formmstService: FormmstService) {}

  @Get()
  getFormMasterAll(@Req() req: Request) {
    return this.formmstService.getFormMasterAll(req.headers.host);
  }

  @Get(':vaname')
  getFormMasterByVaname(@Param('vaname') vaname: string, @Req() req: Request) {
    return this.formmstService.getFormMasterByVaname(vaname, req.headers.host);
  }


  @Post('getFormmst')
  async getFormmst(@Body() searchDto: SearchDto, @Req() req: Request) {
    return this.formmstService.getFormmst(searchDto, req.headers.host);
  }
}
