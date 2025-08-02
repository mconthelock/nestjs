import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JopMarReqService } from './jop-mar-req.service';
import { CreateJopMarReqDto } from './dto/create-jop-mar-req.dto';
import { UpdateJopMarReqDto } from './dto/update-jop-mar-req.dto';

@Controller('jop-mar-req')
export class JopMarReqController {
  constructor(private readonly jopMarReqService: JopMarReqService) {}

  @Post()
  create(@Body() createJopMarReqDto: CreateJopMarReqDto) {
    return this.jopMarReqService.create(createJopMarReqDto);
  }

  @Get()
  findAll() {
    return this.jopMarReqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jopMarReqService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJopMarReqDto: UpdateJopMarReqDto) {
    return this.jopMarReqService.update(+id, updateJopMarReqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jopMarReqService.remove(+id);
  }
}
