import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QaCnService } from './qa-cn.service';
import { CreateQaCnDto } from './dto/create-qa-cn.dto';
import { UpdateQaCnDto } from './dto/update-qa-cn.dto';

@Controller('qa-cn')
export class QaCnController {
  constructor(private readonly qaCnService: QaCnService) {}

  @Post()
  create(@Body() createQaCnDto: CreateQaCnDto) {
    return this.qaCnService.create(createQaCnDto);
  }

  @Get()
  findAll() {
    return this.qaCnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qaCnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQaCnDto: UpdateQaCnDto) {
    return this.qaCnService.update(+id, updateQaCnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qaCnService.remove(+id);
  }
}
