import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpLocalPdmService } from './exp-local-pdm.service';
import { CreateExpLocalPdmDto } from './dto/create-exp-local-pdm.dto';
import { UpdateExpLocalPdmDto } from './dto/update-exp-local-pdm.dto';

@Controller('exp-local-pdm')
export class ExpLocalPdmController {
  constructor(private readonly expLocalPdmService: ExpLocalPdmService) {}

  @Post()
  create(@Body() createExpLocalPdmDto: CreateExpLocalPdmDto) {
    return this.expLocalPdmService.create(createExpLocalPdmDto);
  }

  @Get()
  findAll() {
    return this.expLocalPdmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expLocalPdmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpLocalPdmDto: UpdateExpLocalPdmDto) {
    return this.expLocalPdmService.update(+id, updateExpLocalPdmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expLocalPdmService.remove(+id);
  }
}
