import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurVendorsCodeService } from './pur_vendors_code.service';
import { CreatePurVendorsCodeDto } from './dto/create-pur_vendors_code.dto';
import { UpdatePurVendorsCodeDto } from './dto/update-pur_vendors_code.dto';

@Controller('pur-vendors-code')
export class PurVendorsCodeController {
  constructor(private readonly purVendorsCodeService: PurVendorsCodeService) {}

  @Post()
  create(@Body() createPurVendorsCodeDto: CreatePurVendorsCodeDto) {
    return this.purVendorsCodeService.create(createPurVendorsCodeDto);
  }

  @Get()
  findAll() {
    return this.purVendorsCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purVendorsCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurVendorsCodeDto: UpdatePurVendorsCodeDto) {
    return this.purVendorsCodeService.update(+id, updatePurVendorsCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purVendorsCodeService.remove(+id);
  }
}
