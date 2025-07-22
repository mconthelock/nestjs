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
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Formmst')
@Controller('formmst')
export class FormmstController {
  constructor(private readonly formmstService: FormmstService) {}

  @Get()
  @ApiOperation({
    summary: 'getFormMasterAll',
  })
  getFormMasterAll(@Req() req: Request) {
    return this.formmstService.getFormMasterAll(req.headers.host);
  }

  @Get(':vaname')
  @ApiOperation({
    summary: 'getFormMasterByVaname',
  })
  @ApiParam({ name: 'vaname', example: 'IS-TID', required: true })
  getFormMasterByVaname(@Param('vaname') vaname: string, @Req() req: Request) {
    return this.formmstService.getFormMasterByVaname(vaname, req.headers.host);
  }

  @Post('getFormmst')
  @ApiOperation({
    summary: 'getFormmst',
  })
  async getFormmst(@Body() searchDto: SearchFormmstDto, @Req() req: Request) {
    return this.formmstService.getFormmst(searchDto, req.headers.host);
  }
}
