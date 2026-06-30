import { Controller, Get, Post, Body, Patch, Param, Delete , UseInterceptors   } from '@nestjs/common';
import { FinpckVwstatusService } from './finpck-vwstatus.service';
import { CreateFinpckVwstatusDto } from './dto/create-finpck-vwstatus.dto';
import { UpdateFinpckVwstatusDto } from './dto/update-finpck-vwstatus.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('finform/fin-pck/finpck-vwstatus')
export class FinpckVwstatusController {
  constructor(private readonly finpckVwstatusService: FinpckVwstatusService) {}

  @Post()
  create(@Body() createFinpckVwstatusDto: CreateFinpckVwstatusDto) {
    return this.finpckVwstatusService.create(createFinpckVwstatusDto);
  }

  
  @Post('search')
  @UseInterceptors(NoFilesInterceptor())
      search(@Body() searchBody: any) {
      console.log('--- 1. Data From Frontend ---', searchBody);
      return this.finpckVwstatusService.search(searchBody);
  }
  

  @Get()
  findAll() {
    return this.finpckVwstatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finpckVwstatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinpckVwstatusDto: UpdateFinpckVwstatusDto) {
    return this.finpckVwstatusService.update(+id, updateFinpckVwstatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finpckVwstatusService.remove(+id);
  }
}
