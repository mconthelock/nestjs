import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateRatioDto } from './dto/create-ratio.dto';
import { UpdateRatioDto } from './dto/update-ratio.dto';
import { Ratio } from './entities/ratio.entity';

@Injectable()
export class RatioService {
  constructor(
    @InjectRepository(Ratio, 'amecConnection')
    private readonly ratio: Repository<Ratio>,
  ) {}
}
