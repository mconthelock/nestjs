import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAftsysdocDto } from './dto/create-aftsysdoc.dto';
import { UpdateAftsysdocDto } from './dto/update-aftsysdoc.dto';
import { Aftsysdoc } from './entities/aftsysdoc.entity';

@Injectable()
export class AftsysdocService {
  constructor(
    @InjectRepository(Aftsysdoc, 'amecConnection')
    private readonly aft: Repository<Aftsysdoc>,
  ) {}
}
