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
import { SearchRepDto } from './dto/search-rep.dto';

@Controller('rep')
export class RepController {
  constructor(private readonly repService: RepService) {}

  @Post()

  @Post('search')
  search(@Body() searchRepDto: SearchRepDto) {
    return this.repService.getRep(searchRepDto);
  }

  @Post('getRep')
  getRep(@Body() searchRepDto: SearchRepDto) {
    return this.repService.getRepresent(searchRepDto);
  }
}
