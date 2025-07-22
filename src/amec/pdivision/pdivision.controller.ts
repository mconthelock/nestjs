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
import { SearchDivisionDto } from './dto/search-division.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('AMEC Division')
@Controller('amec/division')
export class PdivisionController {
  constructor(private readonly pdivisionService: PdivisionService) {}

  @Get()
  @ApiOperation({
    summary: 'getDivisionAll',
  })
  getDivisionAll() {
    return this.pdivisionService.getDivisionAll();
  }

  @Get(':code')
  @ApiOperation({
    summary: 'getDivisionByCode',
  })
  @ApiParam({ name: 'code', example: '050101', required: true })
  getDivisionByCode(@Param('code') code: string) {
    return this.pdivisionService.getDivisionByCode(code);
  }

  @Post('getDivision')
  @ApiOperation({
    summary: 'getDivision',
  })
  async getDivision(@Body() searchDto: SearchDivisionDto) {
    return this.pdivisionService.getDivision(searchDto);
  }
}
