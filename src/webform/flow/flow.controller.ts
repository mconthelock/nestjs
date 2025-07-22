import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

import { FlowService } from './flow.service';

import { getExtDataDto } from './dto/get-Extdata.dto';

@ApiTags('Flow')
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post('getExtData')
  @ApiOperation({ summary: 'Get ext data' })
  getFormno(@Body() dto: getExtDataDto, @Req() req: Request) {
    return this.flowService.getExtData(dto, req.headers.host);
  }
}
