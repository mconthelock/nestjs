import { Designer } from './entities/designer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DesignerService {
  constructor(
    @InjectRepository(Designer, 'amecConnection')
    private readonly des: Repository<Designer>,
  ) {}

  async getAll() {
    return await this.des.find();
  }
}
