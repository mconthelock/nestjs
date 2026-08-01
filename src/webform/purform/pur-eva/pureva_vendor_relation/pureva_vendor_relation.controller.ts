import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurevaVendorRelationService } from './pureva_vendor_relation.service';
import { CreatePurevaVendorRelationDto } from './dto/create-pureva_vendor_relation.dto';
import { UpdatePurevaVendorRelationDto } from './dto/update-pureva_vendor_relation.dto';

@Controller('pureva-vendor-relation')
export class PurevaVendorRelationController {
  constructor(private readonly purevaVendorRelationService: PurevaVendorRelationService) {}

  @Post()
  create(@Body() createPurevaVendorRelationDto: CreatePurevaVendorRelationDto) {
    return this.purevaVendorRelationService.create(createPurevaVendorRelationDto);
  }

  @Get()
  findAll() {
    return this.purevaVendorRelationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purevaVendorRelationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurevaVendorRelationDto: UpdatePurevaVendorRelationDto) {
    return this.purevaVendorRelationService.update(+id, updatePurevaVendorRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purevaVendorRelationService.remove(+id);
  }
}
