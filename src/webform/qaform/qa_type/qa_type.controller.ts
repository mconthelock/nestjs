import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QaTypeService } from './qa_type.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('QA Type')
@Controller('qa-type')
export class QaTypeController {
  constructor(private readonly qaTypeService: QaTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get qa type list' })
  getQaTypeAll() {
    return this.qaTypeService.getQaTypeAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get qa type by code' })
  @ApiParam({ name: 'code', example: 'ESA', required: true })
  getQaTypeByCode(@Param('code') code: string) {
    return this.qaTypeService.getQaTypeByCode(code);
  }
}
