import { Busstation } from './entities/busstation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusstationService {
  constructor(
    @InjectRepository(Busstation, 'gpreportConnection')
    private readonly stop: Repository<Busstation>,
  ) {}

  async findAll() {
    return this.stop.find({ relations: ['route'] });
  }

  async create() {}

  async update() {}

  async delete() {}
}
