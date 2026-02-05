import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuspassengerService } from './buspassenger.service';
import { CreateBuspassengerDto } from './dto/create-buspassenger.dto';
import { UpdateBuspassengerDto } from './dto/update-buspassenger.dto';

@Controller('buspassenger')
export class BuspassengerController {
  constructor(private readonly buspassengerService: BuspassengerService) {}

  @Post()
  create(@Body() createBuspassengerDto: CreateBuspassengerDto) {
    return this.buspassengerService.create(createDto);
  }

  @Get()
  findAll() {
    return this.buspassengerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buspassengerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuspassengerDto: UpdateBuspassengerDto) {
    return this.buspassengerService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buspassengerService.remove(+id);
  }
}
