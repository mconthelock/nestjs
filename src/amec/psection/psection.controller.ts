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
import { SearchDto } from './dto/search.dto';

@Controller('amec/section')
export class PsectionController {
  constructor(private readonly psectionService: PsectionService) {}

  @Get()
  getSectionAll() {
    return this.psectionService.getSectionAll();
  }

  @Get(':code')
  getSectionByCode(@Param('code') code: string) {
    return this.psectionService.getSectionByCode(code);
  }

  @Post('getSection')
  async getSection(@Body() searchDto: SearchDto) {
    return this.psectionService.getSection(searchDto);
  }
}
