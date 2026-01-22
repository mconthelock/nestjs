import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { Request } from 'express';

import { FlowService } from './flow.service';

import { SearchFlowDto } from './dto/search-flow.dto';
import { DeleteFlowStepDto, UpdateFlowDto } from './dto/update-flow.dto';
import { FormDto } from '../form/dto/form.dto';
import { empnoFormDto } from '../form/dto/empno-form.dto';
import { doactionFlowDto } from './dto/doaction-flow.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { showFlowDto } from './dto/show-flow.dto';

@ApiTags('Flow')
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post('getExtData')
  @ApiOperation({ summary: 'Get ext data' })
  async getExtData(@Body() dto: empnoFormDto) {
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

  @Delete('deleteFlowStep')
  async deleteFlowStep(
    @Body() dto: DeleteFlowStepDto,
  ): Promise<{ message: string; status: boolean }> {
    try {
      return await this.flowService.deleteFlowStep(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('showflow')
  async showFlow(@Body() dto: showFlowDto) {
    return await this.flowService.showFlow(dto);
  }

  @Post('getFlowTree')
  async getFlowTree(@Body() form: FormDto) {
    return await this.flowService.getFlowTree(form);
  }

  @Post('getEmpFlowStepReady')
  async getEmpFlowStepReady(@Body() form: empnoFormDto) {
    return await this.flowService.getEmpFlowStepReady(form);
  }

  @Post('checkReturn')
  async checkReturn(@Body() dto: empnoFormDto) {
    return await this.flowService.checkReturn(dto);
  }

  @Post('checkReturnb')
  async checkReturnb(@Body() dto: empnoFormDto) {
    return await this.flowService.checkReturnb(dto);
  }

  @Post('doaction')
  @UseInterceptors(AnyFilesInterceptor())
  async doAction(@Body() dto: doactionFlowDto, @Req() req: Request) {
    const ip = getClientIP(req);
    return await this.flowService.doAction(dto, ip);
  }

  @ApiExcludeEndpoint()
  @Post('checkUnfinishedFlow')
  async checkUnfinishedFlow(@Body() form: FormDto) {
    return await this.flowService.checkUnfinishedFlow(form);
  }

  @Post('resetFlow')
  async resetFlow(@Body() form: FormDto) {
    return await this.flowService.resetFlow(form);
  }
}
