import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurVendorsAddressService } from './pur_vendors_address.service';
import { CreatePurVendorsAddressDto } from './dto/create-pur_vendors_address.dto';
import { UpdatePurVendorsAddressDto } from './dto/update-pur_vendors_address.dto';

@Controller('pur-vendors-address')
export class PurVendorsAddressController {
  constructor(private readonly purVendorsAddressService: PurVendorsAddressService) {}

  @Post()
  create(@Body() createPurVendorsAddressDto: CreatePurVendorsAddressDto) {
    return this.purVendorsAddressService.create(createPurVendorsAddressDto);
  }

  @Get()
  findAll() {
    return this.purVendorsAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purVendorsAddressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurVendorsAddressDto: UpdatePurVendorsAddressDto) {
    return this.purVendorsAddressService.update(+id, updatePurVendorsAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purVendorsAddressService.remove(+id);
  }
}
