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

@ApiTags('Flow')
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post('getExtData')
  @ApiOperation({ summary: 'Get ext data' })
  getFormno(@Body() dto: getExtDataDto, @Req() req: Request) {
    return this.flowService.getExtData(dto, req.headers.host);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search flow data' })
  getFlow(@Body() dto: SearchFlowDto, @Req() req: Request) {
    return this.flowService.getFlow(dto, req.headers.host);
  }

  @Patch('updateFlow')
  async updateFlow(
    @Body() dto: UpdateFlowDto,
    @Req() req: Request,
  ): Promise<{ message: string; status: boolean }> {
    try {
      
      const result = await this.flowService.updateFlow(
        dto,
        req.headers.host,
      );
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
    @Req() req: Request,
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.flowService.reAlignFlow(
        dto,
        req.headers.host,
      );
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
    @Req() req: Request,
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.flowService.deleteFlow(
        dto,
        req.headers.host,
      );
      return {
        message: result
          ? 'Flow deleted successfully'
          : 'Failed to delete flow',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }
}
