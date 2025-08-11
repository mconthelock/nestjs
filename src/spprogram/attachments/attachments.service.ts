import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attachments } from './entities/attachments.entity';
import { createAttDto } from './dto/create.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachments, 'amecConnection')
    private readonly att: Repository<Attachments>,
  ) {}

  async create(data: createAttDto) {
    return await this.att.save(data);
  }

  async findInqno(searchDto: any) {
    return await this.att.find({ where: { INQ_NO: searchDto.INQ_NO } });
  }
}
