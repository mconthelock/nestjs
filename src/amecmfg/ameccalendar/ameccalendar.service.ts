import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Ameccalendar } from './entities/ameccalendar.entity';

@Injectable()
export class AmeccalendarService {
  constructor(
    @InjectRepository(Ameccalendar, 'amecConnection')
    private readonly calendar: Repository<Ameccalendar>,
  ) {}

  listCalendar(sdate: number, edate: number) {
    return this.calendar.find({
      where: { WORKID: Between(sdate, edate) },
      order: { WORKID: 'ASC' },
    });
  }
}
