import { Body, Controller, Post, Param } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';
import { DispatchKeyDto } from './dto/dispatch-key.dto';
import { MoveStopDto } from './dto/move-stop.dto';
import { SaveAddPassengerDto } from './dto/save-add-passenger.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { DailyDispatchReportDto } from './dto/dispatch-report.dto';
import { UpdateStatusDispatchDto } from './dto/update-status-dispatch.dto';
import { UpdatePassengerStatusDto } from './dto/update-passenger-status.dto';
import { UpdateLineStatusDto } from './dto/update-line-status.dto';
import { UpdateLineTypeDto } from './dto/update-line-type.dto';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { RunDailyScheduleDto } from './dto/build-run-daily-schedule.dto';
import { ExportAndSendMailDto } from './dto/export-and-sendmail.dto';

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

  @Post('update-status-head')
  async updateDispatchStatus(@Body() dto: SaveDispatchDto) {
    return this.service.updateDispatchStatusHead(dto);
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

  @Post('update-passenger-status')
  async updatePassengerStatus(@Body() dto: UpdatePassengerStatusDto) {
    return await this.service.updatePassengerStatus(dto);
  }

  @Post('update-line-status')
  updateLinedispatchStatus(@Body() dto: UpdateLineStatusDto) {
    return this.service.updateLinedispatchStatus(dto);
  }

  @Post('update-line-type')
  async updateLineType(@Body() dto: UpdateLineTypeDto) {
    return await this.service.updateLineType(dto);
  }

  @Post('job-run-daily-schedule')
  runDailySchedule(@Body() dto: RunDailyScheduleDto) {
    return this.service.runDailySchedule(dto);
  }

  @Post('create-share-folder')
  async createShareFolder() {
    return await this.service.createShareFolder();
  }

  @Post('export-and-sendmail')
  async exportAndSendMail(@Body() dto: ExportAndSendMailDto) {
    return await this.service.exportAndSendMail(dto);
  }

  @Post('auto-update-status-dispatch')
  async update_fin_status_Dispatch() {
    return this.service.update_fin_status_Dispatch();
  }

} 