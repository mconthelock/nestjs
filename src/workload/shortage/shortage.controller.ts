import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShortageService } from './shortage.service'; //มีการเรียกใช้ service ของ shortage
import { CreateShortageDto } from './dto/create-shortage.dto';
import { UpdateShortageDto } from './dto/update-shortage.dto';
import { UpdatePurTrackingDto } from './dto/update-purtracking.dto';
import { CreatePurTrackingDto } from './dto/create-purtracking.dto';

@Controller('shortage')
export class ShortageController {
  constructor(private readonly shortageService: ShortageService) { }

  @Post()
  create(@Body() createShortageDto: CreateShortageDto) {
    return this.shortageService.create(createShortageDto);
  }

  @Get()
  findAll() {
    return this.shortageService.findAll();
  }

  @Get('headerprod')
  getHeadProd5() {
    return this.shortageService.getHeadProd5();
  }

  @Get('report')
  getShortageReport() {
    return this.shortageService.getShortageReport();
  }

  /*@Get('report-noentity')
  getshortageReportNoEntity() {
    return this.shortageService.getshortageReportNoEntity();
  }*/

  //insert short_pur_tracking
  @Post('short-pur-tracking')
  createShortPurTracking(@Body() data: CreatePurTrackingDto) {
    return this.shortageService.createShortPurTracking(data);
  }

  //update short_pur_tracking
  @Patch('short-pur-tracking')
  updateShortPurTracking(@Body() data: UpdatePurTrackingDto) {
    return this.shortageService.updateShortPurTracking(data);
  }

  //get shortage report with invoice data
  @Get('report-inv')
  getShortageReport_inv() {
    return this.shortageService.getShortageReport_inv();
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateShortageDto: UpdateShortageDto) {
    return this.shortageService.update(+id, updateShortageDto);
  }*/

  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.shortageService.remove(+id);
  }*/

  /*@Get('display/:id')
  displayShortage(@Param('id') id: string) {
    return this.shortageService.displayShortage(+id);
  }*/


}
