import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';
import { Busroute } from './entities/busroute.entity';
import { Busstation } from 'src/gpreport/busstation/entities/busstation.entity';

@Injectable()
export class BusrouteService {
  constructor(
    @InjectRepository(Busroute, 'gpreportConnection')
    private readonly bus: Repository<Busroute>,

    @InjectDataSource('gpreportConnection')
    private ds: DataSource,
  ) {}

  create(createBusrouteDto: CreateBusrouteDto) {
    return this.bus.save(createBusrouteDto);
  }

  async update(id: number, dto: UpdateBusrouteDto) {
    const data = await this.bus.findOne({ where: { BUSID: id } });
    if (data) {
      Object.assign(data, dto);
      await this.bus.save(data);
      return await this.bus.findOne({
        where: { BUSID: id },
        relations: ['busstation'],
      });
    }
    throw new NotFoundException(`User with ID "${id}" not found`);
  }

  async delete(id: number) {
    const data = await this.bus.findOne({ where: { BUSID: id } });
    if (data) {
      const runner = this.ds.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        await runner.manager.update(
          Busstation,
          { BUSLINE: id },
          { STATION_STATUS: '0' },
        );

        await runner.manager.update(
          Busroute,
          { BUS_ID: id },
          { BUSTATUS: '0' },
        );
        await runner.commitTransaction();
      } catch (err) {
        await runner.rollbackTransaction();
        throw err;
      } finally {
        await runner.release();
      }
    }
    throw new NotFoundException(`User with ID "${id}" not found`);
  }

  findAll() {
    return this.bus.find({ relations: ['busstation'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} busroute`;
  }

  remove(id: number) {
    return `This action removes a #${id} busroute`;
  }
}
