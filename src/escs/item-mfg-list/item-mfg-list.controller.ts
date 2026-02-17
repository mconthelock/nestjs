import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ItemMfgListService } from './item-mfg-list.service';
import { CreateItemMfgListDto } from './dto/create-item-mfg-list.dto';
import { UpdateItemMfgListDto } from './dto/update-item-mfg-list.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/item-mfg-list')
export class ItemMfgListController {
  constructor(private readonly itemMfgListService: ItemMfgListService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  create(@Body() dto: CreateItemMfgListDto) {
    return this.itemMfgListService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemMfgListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMfgListService.findOne(+id);
  }

  @Post('search')
  @UseTransaction('escsConnection')
  async search(@Body() dto: FiltersDto) {
    return this.itemMfgListService.search(dto);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateItemMfgListDto) {
    return this.itemMfgListService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMfgListService.remove(+id);
  }
}
