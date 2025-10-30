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

  async findBySchd(schd: string, schdp?: string) {
    const where: any = {};
    if (schd) where.M8K01 = schd;
    if (schdp) where.M8K02 = schdp;
    return this.m08.find({
      where: { ...where },
      relations: {
        bmdate: true,
        tags: { process: true },
      },
    });
  }

  async findByBMDate(date: string) {
    return this.m08.find({
      where: { bmdate: { Q9PP: date } },
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
