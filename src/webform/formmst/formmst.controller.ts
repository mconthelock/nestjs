import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { CreateFormmstDto } from './dto/create-formmst.dto';
import { UpdateFormmstDto } from './dto/update-formmst.dto';

@Controller('formmst')
export class FormmstController {
  constructor(private readonly formmstService: FormmstService) {}

  @Post()
  create(@Body() createFormmstDto: CreateFormmstDto) {
    return this.formmstService.create(createFormmstDto);
  }

  @Get()
  findAll() {
    return this.formmstService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formmstService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormmstDto: UpdateFormmstDto) {
    return this.formmstService.update(+id, updateFormmstDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formmstService.remove(+id);
  }
}
