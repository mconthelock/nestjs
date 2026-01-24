import { Partcategory } from './entities/partcategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PartcategoryService {
  constructor(
    @InjectRepository(Partcategory, 'amecConnection')
    private readonly partcategoryRepository: Repository<Partcategory>,
  ) {}
}
