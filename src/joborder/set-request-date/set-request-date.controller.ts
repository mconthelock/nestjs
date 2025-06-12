import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SetRequestDateService } from './set-request-date.service';
import { UpsertSetRequestDateDto } from './dto/create-set-request-date.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetRequestDate } from './entities/set-request-date.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('joborder/request')
export class SetRequestDateController {
  constructor(private readonly setRequestDateService: SetRequestDateService) {}

  // Endpoint สำหรับทำ Upsert
  @Post('setRequestDate')
  async upsert(
    @Body() upsertDto: UpsertSetRequestDateDto,
  ): Promise<{ message: string; data: SetRequestDate; status: number }> {
    // เปลี่ยนชนิดการคืนค่าเป็น void หรือ Response object
    try {
      const result = await this.setRequestDateService.upsert(upsertDto);
      return {
        message:
          result.status == 201
            ? 'Data saved successfully'
            : 'Updated successfully',
        data: result.record,
        status: result.status,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }
}
