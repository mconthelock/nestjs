import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurVendorsAttfileService } from './pur_vendors_attfile.service';
import { CreatePurVendorsAttfileDto } from './dto/create-pur_vendors_attfile.dto';
import { UpdatePurVendorsAttfileDto } from './dto/update-pur_vendors_attfile.dto';

@Controller('pur-vendors-attfile')
export class PurVendorsAttfileController {
  constructor(private readonly purVendorsAttfileService: PurVendorsAttfileService) {}

  @Post()
  create(@Body() createPurVendorsAttfileDto: CreatePurVendorsAttfileDto) {
    return this.purVendorsAttfileService.create(createPurVendorsAttfileDto);
  }

  @Get()
  findAll() {
    return this.purVendorsAttfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purVendorsAttfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurVendorsAttfileDto: UpdatePurVendorsAttfileDto) {
    return this.purVendorsAttfileService.update(+id, updatePurVendorsAttfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purVendorsAttfileService.remove(+id);
  }
}
