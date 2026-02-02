import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PpoService } from './ppo.service';
import { CreatePpoDto } from './dto/create-ppo.dto';
import { UpdatePpoDto } from './dto/update-ppo.dto';
import { SearchPpoDto } from './dto/search-ppo.dto';

@Controller('amec/ppo')
export class PpoController {
  constructor(private readonly ppoService: PpoService) {}

  @Get()
  findAll() {
    return this.ppoService.findAll();
  }

  @Get(':po')
  findOne(@Param('po') po: string) {
    return this.ppoService.findOne(po);
  }

  @Post('search')
  search(@Body() dto: SearchPpoDto) {
    return this.ppoService.search(dto);
  }
}
