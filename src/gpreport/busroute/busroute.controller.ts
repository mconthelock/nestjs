import { Controller, Post, Body } from '@nestjs/common';
import { BusrouteService } from './busroute.service';
import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';

@Controller('bus/route')
export class BusrouteController {
  constructor(private readonly route: BusrouteService) {}

  @Post('create')
  create(@Body() dto: CreateBusrouteDto) {
    return this.route.create(dto);
  }

  @Post('update')
  update(@Body() dto: UpdateBusrouteDto) {
    return this.route.update(dto);
  }

  @Post('delete')
  delete(@Body() dto: UpdateBusrouteDto) {
    return this.route.delete(dto);
  }

  @Post('search')
  find(@Body() dto: UpdateBusrouteDto) {
    return this.route.findAll(dto);
  }
}
