import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Inquiry } from './entities/inquiry.entity';

import { searchDto } from './dto/search.dto';
import { createDto } from './dto/create-inquiry.dto';

import { HistoryService } from '../history/history.service';
interface logs {
  INQ_NO: string;
  INQ_REV: string;
  INQH_USER: string;
  INQH_ACTION: number;
  INQH_REMARK: string;
}

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry, 'amecConnection')
    private readonly inq: Repository<Inquiry>,
    private history: HistoryService,
  ) {}

  async search(searchDto: searchDto) {
    const q = { INQ_LATEST: 1 };
    return this.inq.find({
      where: {
        ...searchDto,
        ...q,
      },
      order: { INQ_ID: 'DESC' },
      relations: ['inqgroup', 'status'],
    });
  }

  async create(createDto: createDto) {
    const inquiry = this.inq.create(createDto);
    const data = await this.inq.save(inquiry);
    const log: logs = {
      INQ_NO: createDto.INQ_NO,
      INQ_REV: createDto.INQ_REV,
      INQH_USER: createDto.INQ_MAR_PIC,
      INQH_ACTION: 1,
      INQH_REMARK: null,
    };
    this.history.create(log);
    return this.inq.findOne({
      where: { INQ_NO: data.INQ_NO, INQ_LATEST: 1 },
    });
  }
}
