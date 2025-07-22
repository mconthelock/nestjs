import { Method } from './entities/method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MethodService {
  constructor(
    @InjectRepository(Method, 'amecConnection')
    private readonly methodRepository: Repository<Method>,
  ) {}

  findAll() {
    return this.methodRepository.find({ order: { METHOD_ID: 'ASC' } });
  }
}
