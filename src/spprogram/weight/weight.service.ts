import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Weight } from './entities/weight.entity';
import { createWeightDto } from './dto/create-weight.dto';

@Injectable()
export class WeightService {
  constructor(
    @InjectRepository(Weight, 'mitsuConnection')
    private readonly weight: Repository<Weight>,
  ) {}

  async create(data: createWeightDto) {
    const weight = this.weight.create(data);
    return this.weight.save(weight);
  }
}
