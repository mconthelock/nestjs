import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { F110kpService } from './f110kp.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('datacenter/f110kp')
export class F110kpController {
  constructor(private readonly f110kpService: F110kpService) {}

  @Get()
  findAll() {
    return this.f110kpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.f110kpService.findOne(id);
  }

  @Post('search')
  @UseTransaction('datacenterConnection')
  async search(@Body() dto: FiltersDto) {
    return this.f110kpService.search(dto);
  }
}
