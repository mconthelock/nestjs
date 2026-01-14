import { Spcalsheet } from './entities/spcalsheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpcalsheetService {
  constructor(
    @InjectRepository(Spcalsheet, 'spsysConnection')
    private readonly sp: Repository<Spcalsheet>,
  ) {}
}
