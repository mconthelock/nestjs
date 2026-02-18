import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBusstopDto } from './dto/create-busstop.dto';
import { UpdateBusstopDto } from './dto/update-busstop.dto';
import { SearchBusstopDto } from './dto/search-busstop.dto';
import { Busstop } from 'src/common/Entities/gpreport/table/busstop.entity';

@Injectable()
export class BusstopService {
  constructor(
    @InjectRepository(Busstop, 'gpreportConnection')
    private readonly stop: Repository<Busstop>,
  ) {}

  async create(dto: CreateBusstopDto) {
    return await this.stop.save(dto);
  }

  async update(dto: UpdateBusstopDto) {
    const data = await this.stop.findOne({ where: { STOP_ID: dto.STOP_ID } });
    if (data) {
      Object.assign(data, dto);
      await this.stop.save(data);
      return await this.stop.findOne({ where: { STOP_ID: dto.STOP_ID } });
    }
    throw new NotFoundException(`Bus/Van with your credentials is not found`);
  }

  async findAll(q: SearchBusstopDto) {
    return await this.stop.find({ where: q });
  }
}
