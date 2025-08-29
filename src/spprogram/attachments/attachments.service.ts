import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attachments } from './entities/attachments.entity';
import { createAttDto } from './dto/create.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachments, 'spsysConnection')
    private readonly att: Repository<Attachments>,
  ) {}

  async create(data: createAttDto) {
    const file = await this.att.create(data);
    return await this.att.save(data);
  }

  async findInqno(searchDto: any) {
    return await this.att.find({ where: { INQ_NO: searchDto.INQ_NO } });
  }

  async findOne(id: number) {
    return await this.att.findOne({ where: { FILE_ID: id } });
  }
}
