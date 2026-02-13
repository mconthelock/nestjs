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
import { ItemMfgService } from './item-mfg.service';
import { CreateItemMfgDto } from './dto/create-item-mfg.dto';
import { UpdateItemMfgDto } from './dto/update-item-mfg.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/item-mfg')
export class ItemMfgController {
  constructor(private readonly itemMfgService: ItemMfgService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  create(@Body() dto: CreateItemMfgDto) {
    return this.itemMfgService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemMfgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMfgService.findOne(+id);
  }

  @Post('search')
  @UseTransaction('escsConnection')
  async search(@Body() dto: FiltersDto) {
    return this.itemMfgService.search(dto);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateItemMfgDto) {
    return this.itemMfgService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMfgService.remove(+id);
  }
}
