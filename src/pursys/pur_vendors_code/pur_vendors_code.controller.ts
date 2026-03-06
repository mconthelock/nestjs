import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurVendorsCodeService } from './pur_vendors_code.service';
import { CreatePurVendorsCodeDto } from './dto/create-pur_vendors_code.dto';
import { UpdatePurVendorsCodeDto } from './dto/update-pur_vendors_code.dto';

@Controller('pursys/pur_vendors_code')
export class PurVendorsCodeController {
  constructor(private readonly purVendorsCodeService: PurVendorsCodeService) {}

  @Post('createvendorcode')
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

  @Post('updatevendorcode')
    update(@Body('id') id: number, @Body() updatePurVendorsCodeDto: UpdatePurVendorsCodeDto) {
    return this.purVendorsCodeService.update(id , updatePurVendorsCodeDto);

  }

  @Post('deletevendorcode')
  remove(@Body('id') id: number) {
    return this.purVendorsCodeService.remove(+id);
  }

}
