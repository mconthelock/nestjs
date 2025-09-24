import { Status } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status, 'spsysConnection')
    private readonly status: Repository<Status>,
  ) {}

  findAll() {
    return this.status.find();
  }
}
