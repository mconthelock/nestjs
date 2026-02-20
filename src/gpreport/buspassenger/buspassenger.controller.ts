import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BuspassengerService } from './buspassenger.service';
import { CreateBuspassengerDto } from './dto/create-buspassenger.dto';
import { UpdateBuspassengerDto } from './dto/update-buspassenger.dto';

@Controller('bus/passenger')
export class BuspassengerController {
  constructor(private readonly buspassengerService: BuspassengerService) {}

  @Post('create')
    create(@Body() dto: CreateBuspassengerDto) {
    return this.buspassengerService.create(dto);
  }
  
  @Post('update')
    update(@Body() dto: UpdateBuspassengerDto) {
    return this.buspassengerService.update(dto);
  }
  
  @Post('delete')
    delete(@Body() dto: UpdateBuspassengerDto) {
    return this.buspassengerService.delete(dto);
  }
  
  @Post('search')
    find(@Body() dto: UpdateBuspassengerDto) {
    return this.buspassengerService.findAll(dto);
  }

  @Post("findAllWithRelations")
  findAll(@Body() dto) {
    return this.buspassengerService.findAllWithRelations(dto.BUSLINE);
  }

  @Post("getAllTransport")
  async getAllTransport() {
    return this.buspassengerService.getAllTransport();
  }
}
