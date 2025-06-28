import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workplan } from './entities/workplan.entity';

@Injectable()
export class WorkplanService {
  constructor(
    @InjectRepository(Workplan, 'amecConnection')
    private readonly workplan: Repository<Workplan>,
  ) {}
}
