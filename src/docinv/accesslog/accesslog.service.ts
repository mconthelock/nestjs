import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Accesslog } from './entities/accesslog.entity';
import { CreateAccesslogDto } from './dto/create-accesslog.dto';

@Injectable()
export class AccesslogService {
  constructor(
    @InjectRepository(Accesslog, 'amecConnection')
    private readonly log: Repository<Accesslog>,
  ) {}

  async create(createAccesslogDto: CreateAccesslogDto) {
    const accesslog = this.log.create({
      LOG_USER: createAccesslogDto.loguser,
      LOG_IP: createAccesslogDto.logip,
      LOG_PROGRAM: createAccesslogDto.logprogram,
      LOG_STATUSES: createAccesslogDto.logstatus,
      LOG_MESSAGE: createAccesslogDto.logmsg,
    });
    await this.log.save(accesslog);
    return 'This action adds a new accesslog';
  }
}
