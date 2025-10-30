import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { M008KP } from '../../as400/rtnlibf/m008kp/entities/m008kp.entity';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(M008KP, 'amecConnection')
    private readonly m08: Repository<M008KP>,
  ) {}

  async findBySchd(schd: string, schdp: string) {
    return this.m08.find({
      where: { M8K01: schd, M8K02: schdp },
      relations: {
        bmdate: true,
        tags: { process: true },
      },
    });
  }

  async findAll() {
    return this.m08.find({
      relations: {
        bmdate: true,
        tags: { process: true },
      },
    });
  }
}
