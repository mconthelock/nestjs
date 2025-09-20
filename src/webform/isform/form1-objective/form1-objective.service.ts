import { Form1Objective } from './entities/form1-objective.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Form1ObjectiveService {
  constructor(
    @InjectRepository(Form1Objective, 'webformConnection')
    private readonly obj: Repository<Form1Objective>,
  ) {}

  async findAll() {
    return this.obj.find();
  }
}
