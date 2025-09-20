import { Form1Wage } from './entities/form1-wage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Form1WageService {
  constructor(
    @InjectRepository(Form1Wage, 'webformConnection')
    private readonly wage: Repository<Form1Wage>,
  ) {}

  findAll() {
    return this.wage.find({ relations: ['pposition'] });
  }
}
