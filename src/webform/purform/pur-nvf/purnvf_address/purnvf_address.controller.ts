import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurnvfAddressService } from './purnvf_address.service';
import { CreatePurnvfAddressDto } from './dto/create-purnvf_address.dto';
import { UpdatePurnvfAddressDto } from './dto/update-purnvf_address.dto';

@Controller('purnvf-address')
export class PurnvfAddressController {
  constructor(private readonly purnvfAddressService: PurnvfAddressService) {}

  @Post()
  create(@Body() createPurnvfAddressDto: CreatePurnvfAddressDto) {
    return this.purnvfAddressService.create(createPurnvfAddressDto);
  }

  @Get()
  findAll() {
    return this.purnvfAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purnvfAddressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurnvfAddressDto: UpdatePurnvfAddressDto) {
    return this.purnvfAddressService.update(+id, updatePurnvfAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purnvfAddressService.remove(+id);
  }
}
