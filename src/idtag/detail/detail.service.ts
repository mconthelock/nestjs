import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { F001KP } from '../../as400/shopf/f001kp/entities/f001kp.entity';

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(F001KP, 'amecConnection')
    private readonly f01: Repository<F001KP>,
  ) {}

  async findOne(id: string) {
    return this.f01.findOne({
      where: { F01R01: id },
      relations: {
        process: true,
        detail: true,
      },
    });
  }
}
