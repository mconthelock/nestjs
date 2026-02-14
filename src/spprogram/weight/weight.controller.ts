import { Controller, Post, Body } from '@nestjs/common';
import { WeightService } from './weight.service';
import { createWeightDto } from './dto/create-weight.dto';

@Controller('sp/weight')
export class WeightController {
  constructor(private readonly weight: WeightService) {}

  @Post('create')
  async create(@Body() data: createWeightDto) {
    return this.weight.create(data);
  }
}
