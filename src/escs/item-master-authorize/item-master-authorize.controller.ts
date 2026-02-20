import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ItemMasterAuthorizeService } from './item-master-authorize.service';
import { CreateItemMasterAuthorizeDto } from './dto/create-item-master-authorize.dto';
import { UpdateItemMasterAuthorizeDto } from './dto/update-item-master-authorize.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/item-master-authorize')
export class ItemMasterAuthorizeController {
  constructor(private readonly itemMasterAuthorizeService: ItemMasterAuthorizeService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  async create(@Body() dto: CreateItemMasterAuthorizeDto) {
    return await this.itemMasterAuthorizeService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemMasterAuthorizeService.findAll();
  }

  @Post('search')
  @UseTransaction('escsConnection') 
  async search(@Body() dto: FiltersDto) {
    return this.itemMasterAuthorizeService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMasterAuthorizeService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateItemMasterAuthorizeDto) {
    return this.itemMasterAuthorizeService.update(+id, dto);
  }

  @Delete(':id')
  @UseTransaction('escsConnection')
  remove(@Param('id') id: string) {
    return this.itemMasterAuthorizeService.remove(+id);
  }
}
