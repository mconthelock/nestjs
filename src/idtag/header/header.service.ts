import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { M008kp } from '../../as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F001KP } from '../../as400/shopf/f001kp/entities/f001kp.entity';
import { Q90010p2 } from '../../as400/rtnlibf/q90010p2/entities/q90010p2.entity';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(M008kp, 'amecConnection')
    private readonly m08: Repository<M008kp>,
  ) {}

  async findBySchd(schd: string, schdp: string) {
    return this.m08.find({ where: { M8K01: schd, M8K02: schdp } });
  }
}
