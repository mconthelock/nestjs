import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JopPurConfService } from './jop-pur-conf.service';
import { CreateJopPurConfDto } from './dto/create-jop-pur-conf.dto';
import { UpdateJopPurConfDto } from './dto/update-jop-pur-conf.dto';

@Controller('jop-pur-conf')
export class JopPurConfController {
  constructor(private readonly jopPurConfService: JopPurConfService) {}

  @Post()
  create(@Body() createJopPurConfDto: CreateJopPurConfDto) {
    return this.jopPurConfService.create(createJopPurConfDto);
  }

  @Get()
  findAll() {
    return this.jopPurConfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jopPurConfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJopPurConfDto: UpdateJopPurConfDto) {
    return this.jopPurConfService.update(+id, updateJopPurConfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jopPurConfService.remove(+id);
  }
}
