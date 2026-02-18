import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';
import { Busroute } from 'src/common/Entities/gpreport/table/busroute.entity';

@Injectable()
export class BusrouteService {
  constructor(
    @InjectRepository(Busroute, 'gpreportConnection')
    private readonly route: Repository<Busroute>,
  ) {}

  async create(dto: CreateBusrouteDto) {
    return this.route.save(dto);
  }

  async update(dto: UpdateBusrouteDto) {
    const data = await this.route.findOne({
      where: { BUSLINE: dto.BUSLINE, STOPNO: dto.STOPNO },
    });
    if (data) {
      Object.assign(data, dto);
      await this.route.save(data);
      return await this.route.findOne({
        where: { BUSLINE: dto.BUSLINE, STOPNO: dto.STOPNO },
      });
    }
    throw new NotFoundException(`Bus/Van with your credentials is not found`);
  }

  async delete(dto: UpdateBusrouteDto) {
    const data = await this.route.findOne({
      where: { BUSLINE: dto.BUSLINE, STOPNO: dto.STOPNO },
    });
    if (data) {
      await this.route.remove(data);
      return { deleted: true };
    }
    throw new NotFoundException(`Bus/Van with your credentials is not found`);
  }

  async findAll(q: UpdateBusrouteDto) {
    return await this.route.find({ where: q });
  }
}
