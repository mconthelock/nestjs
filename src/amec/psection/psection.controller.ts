import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PsectionService } from './psection.service';
import { SearchSectionDto } from './dto/search-section.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('AMEC Section')
@Controller('amec/section')
export class PsectionController {
  constructor(private readonly psectionService: PsectionService) {}

  @Get()
  @ApiOperation({
    summary: 'getSectionAll',
  })
  getSectionAll() {
    return this.psectionService.getSectionAll();
  }

  @Get(':code')
  @ApiOperation({
    summary: 'getSectionByCode',
  })
  @ApiParam({ name: 'code', example: '050604', required: true })
  getSectionByCode(@Param('code') code: string) {
    return this.psectionService.getSectionByCode(code);
  }

  @Post('getSection')
  @ApiOperation({
    summary: 'getSection',
  })
  async getSection(@Body() searchDto: SearchSectionDto) {
    return this.psectionService.getSection(searchDto);
  }
}
