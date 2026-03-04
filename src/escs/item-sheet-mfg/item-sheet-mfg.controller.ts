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
import { ItemSheetMfgService } from './item-sheet-mfg.service';
import { CreateItemSheetMfgDto } from './dto/create-item-sheet-mfg.dto';
import { UpdateItemSheetMfgDto } from './dto/update-item-sheet-mfg.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('escs/item-sheet-mfg')
export class ItemSheetMfgController {
  constructor(private readonly itemSheetMfgService: ItemSheetMfgService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  create(@Body() dto: CreateItemSheetMfgDto) {
    return this.itemSheetMfgService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemSheetMfgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemSheetMfgService.findOne(+id);
  }

  @Get('/item/:itemId')
  findByItemId(@Param('itemId') itemId: string) {
    return this.itemSheetMfgService.findByItemId(+itemId);
  }

  @Post('search')
  @UseTransaction('escsConnection')
  async search(@Body() dto: FiltersDto) {
    return this.itemSheetMfgService.search(dto);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateItemSheetMfgDto) {
    return this.itemSheetMfgService.update(+id, dto);
  }

  @Delete(':id')
  @UseTransaction('escsConnection')
  remove(@Param('id') id: string) {
    return this.itemSheetMfgService.remove(+id);
  }
}
