import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBuslineDto } from './dto/create-busline.dto';
import { UpdateBuslineDto } from './dto/update-busline.dto';
import { SearchBuslineDto } from './dto/search-busline.dto';
import { Busline } from 'src/common/Entities/gpreport/table/busline.entity';

@Injectable()
export class BuslineService {
  constructor(
    @InjectRepository(Busline, 'gpreportConnection')
    private readonly bus: Repository<Busline>,
  ) {}

  async create(dto: CreateBuslineDto) {
    const data = await this.bus.save(dto);
    return await this.bus.findOne({
      where: { BUSID: data.BUSID },
      //   relations: ['station'],
    });
  }

  async update(id: number, dto: UpdateBuslineDto) {
    const data = await this.bus.findOne({ where: { BUSID: id } });
    if (data) {
      Object.assign(data, dto);
      await this.bus.save(data);
      return await this.bus.findOne({
        where: { BUSID: id },
        // relations: ['station'],
      });
    }
    throw new NotFoundException(`Bus/Van with your credentials is not found`);
  }

  findAll(q: SearchBuslineDto) {
    // return this.bus.find({ relations: ['station'] });
    return this.bus.find({ where: q });
  }

  
}
