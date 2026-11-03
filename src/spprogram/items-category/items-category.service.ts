import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class ItemsCategoryService {
  constructor(
    @InjectRepository(Category, 'mitsuConnection')
    private readonly cate: Repository<Category>,
  ) {}

  async findAll() {
    return this.cate.find();
  }
}
