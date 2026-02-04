import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusrouteService } from './busroute.service';
import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';
import { relative } from 'path';

@Controller('gpreport/busroute')
export class BusrouteController {
  constructor(private readonly bus: BusrouteService) {}

  @Post('create')
  create(@Body() createBusrouteDto: CreateBusrouteDto) {
    return this.bus.create(createBusrouteDto);
  }

  @Get()
  findAll() {
    return this.bus.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bus.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusrouteDto: UpdateBusrouteDto,
  ) {
    return this.bus.update(+id, updateBusrouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bus.remove(+id);
  }
}
