import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ItemMfgHistoryService } from './item-mfg-history.service';
import { CreateItemMfgHistoryDto } from './dto/create-item-mfg-history.dto';
import { UpdateItemMfgHistoryDto } from './dto/update-item-mfg-history.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/item-mfg-history')
export class ItemMfgHistoryController {
  constructor(private readonly itemMfgHistoryService: ItemMfgHistoryService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  create(@Body() dto: CreateItemMfgHistoryDto) {
    return this.itemMfgHistoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemMfgHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMfgHistoryService.findOne(+id);
  }

  @Post('search')
  @UseTransaction('escsConnection')
  async search(@Body() dto: FiltersDto) {
    return this.itemMfgHistoryService.search(dto);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateItemMfgHistoryDto) {
    return this.itemMfgHistoryService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMfgHistoryService.remove(+id);
  }
}
