import { Weight } from './entities/weight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeightService {
  constructor(
    @InjectRepository(Weight, 'amecConnection')
    private readonly weightRepository: Repository<Weight>,
  ) {}
}
