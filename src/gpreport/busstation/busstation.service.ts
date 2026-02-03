import { Busstation } from './entities/busstation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusstationService {
  constructor(
    @InjectRepository(Busstation, 'amecConnection')
    private readonly busstationRepository: Repository<Busstation>,
  ) {}
}
