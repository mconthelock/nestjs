import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secretlog } from './entities/doc.entity';
import { createDocDto } from './dto/create.dto';

@Injectable()
export class SecretlogService {
  constructor(
    @InjectRepository(Secretlog, 'amecConnection')
    private readonly docs: Repository<Secretlog>,
  ) {}

  async findAll(): Promise<Secretlog[]> {
    return this.docs.find();
  }

  async create(data: createDocDto): Promise<Secretlog> {
    const newDoc = this.docs.create(data);
    return this.docs.save(newDoc);
  }
}
