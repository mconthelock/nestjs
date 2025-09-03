import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { Ameccalendar } from './entities/ameccalendar.entity';

@Injectable()
export class AmeccalendarService {
  constructor(
    @InjectRepository(Ameccalendar, 'amecConnection')
    private readonly calendar: Repository<Ameccalendar>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  listCalendar(sdate: number, edate: number) {
    return this.calendar.find({
      where: { WORKID: Between(sdate, edate) },
      order: { WORKID: 'ASC' },
    });
  }

  async addWorkDays(
    startDate: number | string | Date,
    days: number,
  ): Promise<Number> {
    startDate = this.transformDate(startDate);
    // console.log(`Adding ${days} work days to start date: ${startDate}`);
    
    const result = await this.dataSource.query(
      `SELECT ADD_WORK_DAYS(:1,:2) AS NEXT_DATE FROM DUAL`,
      [startDate, days],
    );

    return result[0].NEXT_DATE;
  }

  transformDate(date: number | string | Date): number {
    if (typeof date === 'number') {
      // ถ้าเป็น number อยู่แล้ว (เช่น 20250707)
      return date;
    }
    if (typeof date === 'string') {
      // ถ้าเป็น string 8 หลัก
      if (/^\d{8}$/.test(date)) {
        return parseInt(date, 10);
      }
      // ถ้าเป็น string รูปแบบวันที่ เช่น "2025-07-07"
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        return parseInt(match[1] + match[2] + match[3], 10);
      }
    }
    if (date instanceof Date) {
      // ถ้าเป็น Date object
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const d = date.getDate().toString().padStart(2, '0');
      return parseInt(`${y}${m}${d}`, 10);
    }
  }
}
