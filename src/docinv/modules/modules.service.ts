import { Modules } from './entities/modules.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modules, 'amecConnection')
    private readonly modulesRepository: Repository<Modules>,
  ) {}
}
