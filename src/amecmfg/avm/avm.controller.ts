import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvmService } from './avm.service';
import { CreateAvmDto } from './dto/create-avm.dto';
import { UpdateAvmDto } from './dto/update-avm.dto';
import { SearchAvmDto } from './dto/search-avm.dto';

@Controller('avm')
export class AvmController {
  constructor(private readonly avmService: AvmService) {}

  @Post('search')
  search(@Body() searchAvmDto: SearchAvmDto) {
    return this.avmService.search(searchAvmDto);
  }
}
