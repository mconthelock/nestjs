import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PdivisionService } from './pdivision.service';
import { SearchDto } from './dto/search.dto';

@Controller('amec/division')
export class PdivisionController {
  constructor(private readonly pdivisionService: PdivisionService) {}

  @Get()
  getDivisionAll() {
    return this.pdivisionService.getDivisionAll();
  }

  @Get(':code')
  getDivisionByCode(@Param('code') code: string) {
    return this.pdivisionService.getDivisionByCode(code);
  }

  @Post('getDivision')
  async getDivision(@Body() searchDto: SearchDto) {
    return this.pdivisionService.getDivision(searchDto);
  }
}
