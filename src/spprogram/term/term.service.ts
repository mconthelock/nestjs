import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Term } from './entities/term.entity';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term, 'spsysConnection')
    private readonly term: Repository<Term>,
  ) {}

  findAll() {
    return this.term.find();
  }
}
