import { Body, Controller, Post, Param } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';
import { DispatchKeyDto } from './dto/dispatch-key.dto';
import { MoveStopDto } from './dto/move-stop.dto';
import { DeleteLineDto } from './dto/delete-line.dto';
import { SaveAddPassengerDto } from './dto/save-add-passenger.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { DailyDispatchReportDto } from './dto/dispatch-report.dto';
import { UpdateStatusDispatchDto } from './dto/update-status-dispatch.dto';

export class DispatchReportDto {
  @IsString()
  @IsNotEmpty()
  dispatch_id: string;
}

@Controller('bus/dispatch')
export class DispatchController {
  constructor(private readonly service: DispatchService) {}
  @Post('get-dispatch')
  get(@Body() dto: DispatchKeyDto) {
    return this.service.getDispatch(dto);
  }

  @Post('save-overwrite')
  saveOverwrite(@Body() dto: SaveOverwriteDto) {
    return this.service.saveOverwrite(dto);
  }

  
  @Post('update-status')
  updateStatus(@Body() dto: UpdateStatusDispatchDto) {
    return this.service.updateStatus(dto);
  }

  @Post('build-daily-first')
  buildDailyFirst(@Body() dto: BuildDailyFirstDto) {
    return this.service.buildDailyFirst(dto);
  }

  @Post('move-stop')
  async moveStop(@Body() dto: MoveStopDto) {
    return this.service.moveStop(dto);
  }

  @Post('disable-passenger')
  disablePassenger(@Body() dto: { dispatch_id: number; empno: string; update_by: string }) {
    return this.service.disablePassenger(dto);
  }

  @Post('delete-linedispatch')
  async deleteLine(@Body() dto: DeleteLineDto) {
    return await this.service.deleteLinedispatch(dto);
  }
    
  @Post('save-add-passenger')
  async saveAddPassenger(@Body() dto: SaveAddPassengerDto) {
    return this.service.saveAddPassenger(dto);
  }

  @Post('report-bus-daily')
  getReportBus(@Body() dto: DailyDispatchReportDto) {
    return this.service.getReportBus(dto);
  }

  @Post('report-disabled-passenger-daily')
  getReportDisabledPassenger(@Body() dto: DailyDispatchReportDto) {
    return this.service.getReportDisabledPassenger(dto);
  }
}