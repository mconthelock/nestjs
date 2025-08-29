import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createDto } from './dto/create.dto';

import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History, 'spsysConnection')
    private readonly history: Repository<History>,
  ) {}

  async create(createDto: createDto) {
    const history = await this.history.create(createDto);
    return await this.history.save(history);
  }

  async findOne(no: string) {
    return await this.history.find({
      where: { INQ_NO: no },
      relations: ['users', 'status'],
      order: { INQH_DATE: 'DESC' },
    });
  }
}
