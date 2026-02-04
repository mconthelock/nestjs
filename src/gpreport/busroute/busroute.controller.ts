import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BusrouteService } from './busroute.service';
import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';

@Controller('gpreport/busroute')
export class BusrouteController {
  constructor(private readonly bus: BusrouteService) {}

  @Post('create')
  create(@Body() createBusrouteDto: CreateBusrouteDto) {
    return this.bus.create(createBusrouteDto);
  }

  @Post('update/:id')
  update(
    @Param('id') id: number,
    @Body() UpdateBusrouteDto: UpdateBusrouteDto,
  ) {
    return this.bus.update(id, UpdateBusrouteDto);
  }

  @Post('delete/:id')
  delete(@Param('id') id: number) {
    return this.bus.delete(id);
  }

  @Get()
  findAll() {
    return this.bus.findAll();
  }
}
