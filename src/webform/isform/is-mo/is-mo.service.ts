import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IsMo } from './entities/is-mo.entity';

@Injectable()
export class IsMoService {
  constructor(
    @InjectRepository(IsMo, 'amecConnection')
    private readonly ismo: Repository<IsMo>,
  ) {}
}
