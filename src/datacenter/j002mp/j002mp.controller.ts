import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { J002mpService } from './j002mp.service';
import { getData } from './dto/searchJ002.dto';

@Controller('J002mp')
export class J002mpController {
  constructor(private readonly J002mpService: J002mpService) {}
  @Post()
  searchData(@Body() dto: getData){
    return this.J002mpService.searchData(dto);
  }
}
