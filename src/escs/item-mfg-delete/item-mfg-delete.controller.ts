import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ItemMfgDeleteService } from './item-mfg-delete.service';
import { CreateItemMfgDeleteDto } from './dto/create-item-mfg-delete.dto';
import { UpdateItemMfgDeleteDto } from './dto/update-item-mfg-delete.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/item-mfg-delete')
export class ItemMfgDeleteController {
  constructor(private readonly itemMfgDeleteService: ItemMfgDeleteService) {}ฃ

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  async create(@Body() dto: CreateItemMfgDeleteDto) {
    return await this.itemMfgDeleteService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemMfgDeleteService.findAll();
  }

  @Post('search')
  @UseTransaction('escsConnection') 
  async search(@Body() dto: FiltersDto) {
    return this.itemMfgDeleteService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMfgDeleteService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateItemMfgDeleteDto) {
    return this.itemMfgDeleteService.update(+id, dto);
  }

  @Delete(':id')
  @UseTransaction('escsConnection')
  remove(@Param('id') id: string) {
    return this.itemMfgDeleteService.remove(+id);
  }
}
