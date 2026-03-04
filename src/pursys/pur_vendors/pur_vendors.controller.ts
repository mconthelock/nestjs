import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurVendorsService } from './pur_vendors.service';
import { CreatePurVendorDto } from './dto/create-pur_vendor.dto';
import { UpdatePurVendorDto } from './dto/update-pur_vendor.dto';
import { SearchPurVendorDto } from './dto/search-pur_vendor.dto';
import { Query } from '@nestjs/common';

@Controller('pursys/pur_vendors')
export class PurVendorsController {
  constructor(private readonly purVendorsService: PurVendorsService) {}

  @Post('createvendor')
  create(@Body() createPurVendorDto: CreatePurVendorDto) {
    return this.purVendorsService.create(createPurVendorDto);
  }

  // @Get()
  // findAll() {
  //   return this.purVendorsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purVendorsService.findOne(+id);
  // }

  @Get('search')
  search(@Query() searchDto: SearchPurVendorDto) {
    return this.purVendorsService.search(searchDto);
  }


  @Post('updatevendor')
    update(@Body('id') id: number, @Body() updatePurVendorDto: UpdatePurVendorDto) {
    return this.purVendorsService.update(id , updatePurVendorDto);

  }



  @Post('deletevendor')
  remove(@Body('id') id: number) {
    return this.purVendorsService.remove(+id);
  }
}
