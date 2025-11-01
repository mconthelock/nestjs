import { Program } from './entities/program.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program, 'amecConnection')
    private readonly programRepository: Repository<Program>,
  ) {}
}
