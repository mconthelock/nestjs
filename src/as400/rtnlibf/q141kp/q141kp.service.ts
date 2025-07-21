import { Q141kp } from './entities/q141kp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Q141kpService {
  constructor(
    @InjectRepository(Q141kp, 'amecConnection')
    private readonly q141kpRepository: Repository<Q141kp>,
  ) {}
}
