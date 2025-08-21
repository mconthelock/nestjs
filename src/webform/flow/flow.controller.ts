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
import { SearchFlowDto } from './dto/search-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

interface form{
    NFRMNO: number;
    VORGNO: string;
    CYEAR: string;
    CYEAR2: string;
    NRUNNO: number;
}

@ApiTags('Flow')
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post('getExtData')
  @ApiOperation({ summary: 'Get ext data' })
  getFormno(@Body() dto: getExtDataDto) {
    return this.flowService.getExtData(dto);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search flow data' })
  getFlow(@Body() dto: SearchFlowDto) {
    return this.flowService.getFlow(dto);
  }

  @Patch('updateFlow')
  async updateFlow(
    @Body() dto: UpdateFlowDto,
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.flowService.updateFlow(dto);
      return {
        message: result ? 'Flow updated successfully' : 'Failed to update flow',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Patch('realignFlow')
  async realignFlow(
    @Body() dto: UpdateFlowDto,
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.flowService.reAlignFlow(dto);
      return {
        message: result
          ? 'Flow realigned successfully'
          : 'Failed to realign flow',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Delete('deleteFlow')
  async deleteFlow(
    @Body() dto: UpdateFlowDto,
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.flowService.deleteFlow(dto);
      return {
        message: result ? 'Flow deleted successfully' : 'Failed to delete flow',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Post('showflow')
  async showFlow(@Body() form: form, @Req() req: Request) {
      return await this.flowService.showFlow(form, req.headers.host);
  }

  @Post('getFlowTree')
  async getFlowTree(@Body() form: form) {
      return await this.flowService.getFlowTree(form);
  }
}
