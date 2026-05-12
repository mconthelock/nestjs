import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MfgEdrService } from './mfg-edr.service';
import { CreateMfgEdrDto } from './dto/create-mfg-edr.dto';
import { SearchCauseDto } from './dto/search-cause.dto';
import { GetMfgEdrDto } from './dto/get-mfg-edr.dto';


@Controller('mfg-edr')
export class MfgEdrController {
  constructor(private readonly mfgEdrService: MfgEdrService) {}

  @Post()
  create(@Body() createMfgEdrDto: CreateMfgEdrDto) {
    return this.mfgEdrService.create(createMfgEdrDto);
  }

  @Post('update-detail')
  updateDetail(@Body() dto: CreateMfgEdrDto) {
    return this.mfgEdrService.updateDetail(dto);
  }
  
  @Get()
  findAll() {
    return this.mfgEdrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mfgEdrService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mfgEdrService.remove(+id);
  }

  @Post('cause')
  getCause(@Body() dto: SearchCauseDto) {
    return this.mfgEdrService.getCause(dto);
  }

  @Post('worktype')
  getWorktype() {
    return this.mfgEdrService.getWorktype();
  }

  @Post('process')
  getProcess() {
    return this.mfgEdrService.getProcess();
  }

  @Post('line')
  getLine() {
    return this.mfgEdrService.getLine();
  }

  @Post('amec-order-detail')
  getOrderDetail(@Body() body: any) {
    return this.mfgEdrService.getOrderDetail(body.MFGNO);
  }

  @Post('get')
  getMfgEdr(@Body() dto: GetMfgEdrDto) {
    return this.mfgEdrService.getMfgEdr(dto);
  }

}



