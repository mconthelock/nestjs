import { Controller, Get, Post, Body, Patch, Param, Delete , Query , UseInterceptors } from '@nestjs/common';
import { FinpckVwdetailService } from './finpck-vwdetail.service';
import { CreateFinpckVwdetailDto } from './dto/create-finpck-vwdetail.dto';
import { UpdateFinpckVwdetailDto } from './dto/update-finpck-vwdetail.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('finform/fin-pck/finpck-vwdetail')
export class FinpckVwdetailController {
  constructor(private readonly finpckVwdetailService: FinpckVwdetailService) {}

  @Post()
  create(@Body() createFinpckVwdetailDto: CreateFinpckVwdetailDto) {
    return this.finpckVwdetailService.create(createFinpckVwdetailDto);
  }

  @Post('search')
   @UseInterceptors(NoFilesInterceptor())
    search(@Body() searchBody: any) {
    console.log('--- 1. Data From Frontend ---', searchBody);
    return this.finpckVwdetailService.search(searchBody);
  }

  @Get()
  findAll() {
    return this.finpckVwdetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finpckVwdetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinpckVwdetailDto: UpdateFinpckVwdetailDto) {
    return this.finpckVwdetailService.update(+id, updateFinpckVwdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finpckVwdetailService.remove(+id);
  }
}
