import { Pposition } from './entities/pposition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PpositionService {
  constructor(
    @InjectRepository(Pposition, 'webformConnection')
    private readonly spos: Repository<Pposition>,
  ) {}

  findAll() {
    return this.spos.find({ relations: ['wage'] });
  }
}
