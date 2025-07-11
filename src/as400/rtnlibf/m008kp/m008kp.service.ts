import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { M008kp } from './entities/m008kp.entity';

@Injectable()
export class M008kpService {
  constructor(
    @InjectRepository(M008kp, 'amecConnection')
    private readonly m8: Repository<M008kp>,
  ) {}
}
