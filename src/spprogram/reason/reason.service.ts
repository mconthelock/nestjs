import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reason } from './entities/reason.entity';

@Injectable()
export class ReasonService {
  constructor(
    @InjectRepository(Reason, 'amecConnection')
    private readonly reason: Repository<Reason>,
  ) {}

  findAll() {
    return this.reason.find({
      order: { REASON_CODE: 'ASC', REASON_ID: 'ASC' },
    });
  }
}
