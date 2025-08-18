import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JopPurConfService } from './jop-pur-conf.service';
import { CreateJopPurConfDto } from './dto/create-jop-pur-conf.dto';
import { UpdateJopPurConfDto } from './dto/update-jop-pur-conf.dto';
import { SearchJopPurConfDto } from './dto/search-jop-pur-conf.dto';

@Controller('joborder/confirm')
export class JopPurConfController {
  constructor(private readonly jopPurConfService: JopPurConfService) {}

  @Post('setPurConfirm')
  async create(@Body() dto: CreateJopPurConfDto) {
    return await this.jopPurConfService.create(dto);
  }

  @Post('search')
  async search(@Body() dto: SearchJopPurConfDto) {
    return await this.jopPurConfService.search(dto);
  }
}


