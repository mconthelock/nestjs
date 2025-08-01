import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { FlowmstService } from './flowmst.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Flow master')
@Controller('flowmst')
export class FlowmstController {
  constructor(private readonly flowmstService: FlowmstService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all flow masters',
  })
  getFlowMasterAll() {
    return this.flowmstService.getFlowMasterAll();
  }

  @Get(':NFRMNO/:VORGNO/:CYEAR')
  @ApiOperation({
    summary: 'Get flow master by NFRMNO, VORGNO, and CYEAR',
  })
  @ApiParam({ name: 'NFRMNO', example: 13, required: true })
  @ApiParam({ name: 'VORGNO', example: '000101', required: true })
  @ApiParam({ name: 'CYEAR', example: '25', required: true })
  getFlowMaster(
    @Param('NFRMNO') NFRMNO: number,
    @Param('VORGNO') VORGNO: string,
    @Param('CYEAR') CYEAR: string
  ) {
    return this.flowmstService.getFlowMaster(NFRMNO, VORGNO, CYEAR);
  }
}
