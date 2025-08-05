import { Spusers } from './entities/spusers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpusersService {
  constructor(
    @InjectRepository(Spusers, 'amecConnection')
    private readonly spusersRepository: Repository<Spusers>,
  ) {}
}
