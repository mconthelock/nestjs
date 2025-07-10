import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';
import { Q90010p2 } from 'src/as400/rtnlibf/q90010p2/entities/q90010p2.entity';
import { M008kp } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(F001KP, 'amecConnection')
    private readonly f01: Repository<F001KP>,

    @InjectRepository(Q90010p2, 'amecConnection')
    private readonly q9: Repository<Q90010p2>,
  ) {}

  async findBySchd() {}
}
