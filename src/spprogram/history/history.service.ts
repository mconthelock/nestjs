import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { createDto } from './dto/create.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History, 'amecConnection')
    private readonly history: Repository<History>,
  ) {}

  create(createDto: createDto) {
    const history = this.history.create(createDto);
    return this.history.save(history);
  }

  findOne(no: string) {
    return this.history.find({
      where: { INQ_NO: no },
      order: { INQH_DATE: 'DESC' },
    });
  }
}
