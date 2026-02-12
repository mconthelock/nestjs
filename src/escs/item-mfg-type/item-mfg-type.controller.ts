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
import { ItemMfgTypeService } from './item-mfg-type.service';
import { CreateItemMfgTypeDto } from './dto/create-item-mfg-type.dto';
import { UpdateItemMfgTypeDto } from './dto/update-item-mfg-type.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/item-mfg-type')
export class ItemMfgTypeController {
  constructor(private readonly itemMfgTypeService: ItemMfgTypeService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  create(@Body() dto: CreateItemMfgTypeDto) {
    return this.itemMfgTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemMfgTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMfgTypeService.findOne(+id);
  }

  @Post('search')
  @UseTransaction('escsConnection')
  async search(@Body() dto: FiltersDto) {
    return this.itemMfgTypeService.search(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemMfgTypeDto) {
    return this.itemMfgTypeService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMfgTypeService.remove(+id);
  }
}
