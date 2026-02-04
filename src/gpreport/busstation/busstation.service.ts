import { Busstation } from './entities/busstation.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateBusstationDto } from './dto/create-busstation.dto';
import { UpdateBusstationDto } from './dto/update-busstation.dto';

@Injectable()
export class BusstationService {
  constructor(
    @InjectRepository(Busstation, 'gpreportConnection')
    private readonly stop: Repository<Busstation>,

    @InjectDataSource('gpreportConnection')
    private ds: DataSource,
  ) {}

  async findAll() {
    return this.stop.find({ relations: ['route'] });
  }

  async create(dto: CreateBusstationDto) {
    return this.stop.save(dto);
  }

  async update(id: number, dto: UpdateBusstationDto) {
    const data = await this.stop.findOne({ where: { STATION_ID: id } });
    if (data) {
      Object.assign(data, dto);
      await this.stop.save(data);
      return await this.stop.findOne({
        where: { STATION_ID: id },
        relations: ['route'],
      });
    }
  }

  async delete() {}
}
