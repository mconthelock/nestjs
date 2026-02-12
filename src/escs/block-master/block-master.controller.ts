import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { BlockMasterService } from './block-master.service';
import { CreateBlockMasterDto } from './dto/create-block-master.dto';
import { UpdateBlockMasterDto } from './dto/update-block-master.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/block-master')
export class BlockMasterController {
  constructor(private readonly blockMasterService: BlockMasterService) {}

  @Post()
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
  async create(@Body() createBlockMasterDto: CreateBlockMasterDto) {
    return await this.blockMasterService.create(createBlockMasterDto);
  }

  @Get()
  findAll() {
    return this.blockMasterService.findAll();
  }

  @Post('search')
  @UseTransaction('escsConnection') 
  async search(@Body() dto: FiltersDto) {
    return this.blockMasterService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockMasterService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(getFileUploadInterceptor())
  @UseTransaction('escsConnection')
  update(@Param('id') id: string, @Body() dto: UpdateBlockMasterDto) {
    return this.blockMasterService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockMasterService.remove(+id);
  }
}
