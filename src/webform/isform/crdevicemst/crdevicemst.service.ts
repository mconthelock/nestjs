import { Crdevicemst } from './entities/crdevicemst.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CrdevicemstService {
  constructor(
    @InjectRepository(Crdevicemst, 'webformConnection')
    private readonly device: Repository<Crdevicemst>,
  ) {}

  findAll() {
    return this.device.find();
  }
}
