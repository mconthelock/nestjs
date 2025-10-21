import { Mode } from './entities/mode.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModeService {
  constructor(
    @InjectRepository(Mode, 'amecConnection')
    private readonly modeRepository: Repository<Mode>,
  ) {}
}
