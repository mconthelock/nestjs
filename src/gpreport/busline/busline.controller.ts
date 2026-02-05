import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BuslineService } from './busline.service';
import { CreateBuslineDto } from './dto/create-busline.dto';
import { UpdateBuslineDto } from './dto/update-busline.dto';
import { SearchBuslineDto } from './dto/search-busline.dto';

@Controller('bus/line')
export class BuslineController {
  constructor(private readonly bus: BuslineService) {}

  @Post('create')
  create(@Body() dto: CreateBuslineDto) {
    return this.bus.create(dto);
  }

  @Post('update')
  update(@Body() dto: UpdateBuslineDto) {
    return this.bus.update(dto.BUSID, dto);
  }

  @Post('delete')
  delete(@Body() dto: UpdateBuslineDto) {
    const id = dto.BUSID;
    return this.bus.update(id, { BUSID: id, BUSSTATUS: '0' });
  }

  @Post('search')
  findAll(@Body() q: SearchBuslineDto) {
    return this.bus.findAll(q);
  }
}
