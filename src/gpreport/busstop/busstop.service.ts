import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBusstopDto } from './dto/create-busstop.dto';
import { UpdateBusstopDto } from './dto/update-busstop.dto';
import { SearchBusstopDto } from './dto/search-busstop.dto';
import { Busstop } from 'src/common/Entities/gpreport/table/busstop.entity';
import { Buspassenger } from 'src/common/Entities/gpreport/table/buspassenger.entity';
import { Busroute } from 'src/common/Entities/gpreport/table/busroute.entity';

@Injectable()
export class BusstopService {
  constructor(
    @InjectRepository(Busstop, 'gpreportConnection')
    private readonly stop: Repository<Busstop>,

    @InjectDataSource('gpreportConnection')
    private readonly dataSource: DataSource,
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

  async deleteStop(stopId: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager.update(Busstop, { STOP_ID: stopId }, { STOP_STATUS: '0' });
      await manager.delete(Buspassenger, { BUSSTOP: stopId });
      return { success: true };
    });
  }

  async getStopRoutes() {
    const stops = await this.stop.find({
      where: {
        STOP_STATUS: '1',
        routes: {},
      },
      relations: { routes: true, },
      order: { STOP_NAME: 'ASC', },
    });

    return stops.flatMap((stop) =>
      (stop.routes || []).map((route) => ({
        STOP_ID: stop.STOP_ID,
        STOP_NAME: stop.STOP_NAME,
        STOP_STATUS: stop.STOP_STATUS,
        WORKDAY_TIMEIN: stop.WORKDAY_TIMEIN,
        NIGHT_TIMEIN: stop.NIGHT_TIMEIN,
        HOLIDAY_TIMEIN: stop.HOLIDAY_TIMEIN,
        BUSLINE: route.BUSLINE,
      })),
    );
  }

  
}
