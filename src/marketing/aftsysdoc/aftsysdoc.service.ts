import { Aftsysdoc } from './entities/aftsysdoc.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AftsysdocService {
  constructor(
    @InjectRepository(Aftsysdoc, 'amecConnection')
    private readonly aftsysdocRepository: Repository<Aftsysdoc>,
  ) {}
}
