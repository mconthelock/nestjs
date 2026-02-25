import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBuslineDto } from './dto/create-busline.dto';
import { UpdateBuslineDto } from './dto/update-busline.dto';
import { SearchBuslineDto } from './dto/search-busline.dto';
import { Busline } from 'src/common/Entities/gpreport/table/busline.entity';
import { Busstop } from 'src/common/Entities/gpreport/table/busstop.entity';
import { Buspassenger } from 'src/common/Entities/gpreport/table/buspassenger.entity';
import { Busroute } from 'src/common/Entities/gpreport/table/busroute.entity';

@Injectable()
export class BuslineService {
  constructor(
    @InjectRepository(Busline, 'gpreportConnection')
    private readonly bus: Repository<Busline>,

    @InjectDataSource('gpreportConnection')
    private readonly dataSource: DataSource,
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

  async deleteLineCascade(busId: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager.update(Busline, { BUSID: busId }, { BUSSTATUS: '0' });
      
      //  หา stop ของ line
      const routes = await manager.find(Busroute, { where: { BUSLINE: busId } });
      const stopIds = routes.map(r => r.STOPNO);
    
      await manager.delete(Busroute, { BUSLINE: busId });

      if (stopIds.length > 0) {
        await manager.update(Busstop, { STOP_ID: In(stopIds) }, { STOP_STATUS: '0' });
        await manager.delete(Buspassenger, { BUSSTOP: In(stopIds) });
      }

      return { success: true };
    });
  }

  
}
