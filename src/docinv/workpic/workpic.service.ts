import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workpic } from './entities/workpic.entity';

@Injectable()
export class WorkpicService {
  constructor(
    @InjectRepository(Workpic, 'docinvConnection')
    private readonly pic: Repository<Workpic>,
  ) {}
}
