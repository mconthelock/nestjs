import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Accesslog } from './entities/accesslog.entity';
import { CreateAccesslogDto } from './dto/create-accesslog.dto';

@Injectable()
export class AccesslogService {
  constructor(
    @InjectRepository(Accesslog, 'docinvConnection')
    private readonly log: Repository<Accesslog>,
  ) {}

  async create(createAccesslogDto: CreateAccesslogDto) {
    const accesslog = this.log.create({
      LOG_USER: createAccesslogDto.loguser,
      LOG_IP: createAccesslogDto.logip,
      LOG_PROGRAM: createAccesslogDto.logprogram,
      LOG_STATUSES: createAccesslogDto.logstatus,
      LOG_MESSAGE: createAccesslogDto.logmsg,
      LOG_DATE: new Date(),
    });
    await this.log.save(accesslog);
    return 'This action adds a new accesslog';
  }

  async getLoginLogs(id: number) {
    return this.log.find({
      where: { LOG_PROGRAM: id },
      order: { LOG_DATE: 'DESC' },
      relations: ['users'],
    });
  }
}
