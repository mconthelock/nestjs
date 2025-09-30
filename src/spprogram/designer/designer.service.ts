import { Designer } from './entities/designer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DesignerService {
  constructor(
    @InjectRepository(Designer, 'spsysConnection')
    private readonly des: Repository<Designer>,
  ) {}

  async getAll() {
    return await this.des.find();
  }

  async update(data: any, id: string) {
    const existing = await this.des.findOneBy({ DES_USER: id });
    if (!existing) {
      return await this.des.insert({ DES_USER: id, ...data });
    }
    return await this.des.update({ DES_USER: id }, data);
  }
}
