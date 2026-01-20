import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RepService } from './rep.service';
import { CreateRepDto } from './dto/create-rep.dto';
import { UpdateRepDto } from './dto/update-rep.dto';
import { SearchRepDto } from './dto/search-rep.dto';

@Controller('rep')
export class RepController {
  constructor(private readonly repService: RepService) {}

  @Post()
  create(@Body() createRepDto: CreateRepDto) {
    return this.repService.create(createRepDto);
  }

  @Get()
  findAll() {
    return this.repService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepDto: UpdateRepDto) {
    return this.repService.update(+id, updateRepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repService.remove(+id);
  }

  @Post('search')
  search(@Body() searchRepDto: SearchRepDto) {
    return this.repService.getRep(searchRepDto);
  }

  @Post('getRep')
  getRep(@Body() searchRepDto: SearchRepDto) {
    return this.repService.getRepresent(searchRepDto);
  }
}
