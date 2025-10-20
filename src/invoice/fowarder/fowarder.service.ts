import { Fowarder } from './entities/fowarder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FowarderService {
  constructor(
    @InjectRepository(Fowarder, 'invoiceConnection')
    private readonly fwd: Repository<Fowarder>,
  ) {}

  findAll() {
    return this.fwd.find();
  }
}
