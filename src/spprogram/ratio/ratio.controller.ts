import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { RatioService } from './ratio.service';
import { createDto } from './dto/create.dto';
import { findOneDto } from './dto/findone.dto';

interface statusData {
  id: number;
  status: number;
}

@Controller('sp/priceratio')
export class RatioController {
  constructor(private readonly ratio: RatioService) {}

  @Get()
  findAll() {
    return this.ratio.findAll();
  }

  @Post('find')
  findOne(@Body() findOneDto: findOneDto) {
    return this.ratio.findOne(findOneDto);
  }

  @Post('create')
  async create(@Body() createDto: createDto) {
    const exiting = await this.ratio.findOne({
      TRADER: createDto.TRADER,
      SUPPLIER: createDto.SUPPLIER,
      QUOTATION: createDto.QUOTATION,
    });

    if (exiting.length > 0)
      if (exiting[0].ID != createDto.ID)
        throw new BadRequestException('Dupplicated Data');

    const isDup = await this.ratio.findID(createDto.ID);
    if (isDup.length > 0) return this.ratio.update(createDto);
    return this.ratio.create(createDto);
  }

  @Post('status')
  async status(@Body() { status, id }: statusData) {
    return this.ratio.toggleStatus(id, status);
  }
}
