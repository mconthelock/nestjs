import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Ratio } from './entities/ratio.entity';

@Injectable()
export class RatioService {
  constructor(
    @InjectRepository(Ratio, 'amecConnection')
    private readonly ratio: Repository<Ratio>,
  ) {}

  findAll() {
    return this.ratio.find({ relations: ['quoText'] });
  }
}
