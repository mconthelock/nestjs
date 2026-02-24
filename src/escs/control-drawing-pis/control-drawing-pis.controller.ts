import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ControlDrawingPisService } from './control-drawing-pis.service';
import { CreateControlDrawingPisDto } from './dto/create-control-drawing-pis.dto';
import { UpdateControlDrawingPisDto } from './dto/update-control-drawing-pis.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/control-drawing-pis')
export class ControlDrawingPisController {
  constructor(private readonly controlDrawingPisService: ControlDrawingPisService) {}
  
    @Post()
    @UseInterceptors(getFileUploadInterceptor())
    @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
    async create(@Body() dto: CreateControlDrawingPisDto) {
      return await this.controlDrawingPisService.create(dto);
    }
  
    @Get()
    findAll() {
      return this.controlDrawingPisService.findAll();
    }
  
    @Post('search')
    @UseTransaction('escsConnection') 
    async search(@Body() dto: FiltersDto) {
      return this.controlDrawingPisService.search(dto);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.controlDrawingPisService.findOne(+id);
    }
  
    @Patch(':id')
    @UseInterceptors(getFileUploadInterceptor())
    @UseTransaction('escsConnection')
    update(@Param('id') id: string, @Body() dto: UpdateControlDrawingPisDto) {
      return this.controlDrawingPisService.update(+id, dto);
    }
  
    @Delete(':id')
    @UseTransaction('escsConnection')
    remove(@Param('id') id: string) {
      return this.controlDrawingPisService.remove(+id);
    }
}
