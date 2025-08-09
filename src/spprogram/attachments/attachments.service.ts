import { Attachments } from './entities/attachments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
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
}
