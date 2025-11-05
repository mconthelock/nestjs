import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Scheduler } from './entities/scheduler.entity';
import { createSchdDto } from './dto/create.dto';
import { updateSchdDto } from './dto/update.dto';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Scheduler, 'amecConnection')
    private readonly schd: Repository<Scheduler>,
  ) {}

  async findAll(): Promise<Scheduler[]> {
    return this.schd.find();
  }

  async create(data: createSchdDto) {
    const newSchd = this.schd.create(data);
    return this.schd.save(newSchd);
  }

  async update(data: updateSchdDto) {
    await this.schd.update(data.TASKID, data);
    return this.schd.findOneBy({ TASKID: data.TASKID });
  }
}
