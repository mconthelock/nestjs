import { Controller, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { SetRequestDateService } from './set-request-date.service';
import { UpsertSetRequestDateDto } from './dto/create-set-request-date.dto';
import { UpdateSetRequestDateDto } from './dto/update-set-request-date.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetRequestDate } from './entities/set-request-date.entity';
import { AmeccalendarService } from '../../amecmfg/ameccalendar/ameccalendar.service';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';

// @UseGuards(AuthGuard('jwt'))
@Controller('joborder/requestOld')
export class SetRequestDateController {
  constructor(
    private readonly setRequestDateService: SetRequestDateService,
    private readonly amecCalendarService: AmeccalendarService,
) {}

  // Endpoint สำหรับทำ Upsert
  @Post('setRequestDate')
  @ApiExcludeEndpoint()
  async upsert(
    @Body() upsertDto: UpsertSetRequestDateDto,
  ): Promise<{ message: string; data: SetRequestDate; status: number, rev?: SetRequestDate[] }> {
    // เปลี่ยนชนิดการคืนค่าเป็น void หรือ Response object
    try {
        // throw new Error('This is a test error'); // ทดสอบการโยนข้อผิดพลาด
      const result = await this.setRequestDateService.setRequestDate(upsertDto);
      result.record.DeadLinePUR = await this.amecCalendarService.addWorkDays(result.record.JOP_MAR_INPUT_DATE, 7);
      return {
        message: 'Data saved successfully',
        data: result.record,
        rev: result.revision || [], // ถ้ามี revision ให้คืนค่าไปด้วย
        status: result.status,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Patch()
  @ApiExcludeEndpoint()
  async UpdateJop(
    @Body() dto: UpdateSetRequestDateDto,
  ): Promise<{ message: string; data: SetRequestDate[]; status: number }> {
    try {
      const result = await this.setRequestDateService.UpdateJop(dto);
      return {
        message: 'Data confirmed successfully',
        data: result.record,
        status: result.status,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

}
