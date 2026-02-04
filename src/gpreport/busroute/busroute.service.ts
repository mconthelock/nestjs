import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Busroute } from './entities/busroute.entity';
import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';

@Injectable()
export class BusrouteService {
  constructor(
    @InjectRepository(Busroute, 'gpreportConnection')
    private readonly bus: Repository<Busroute>,
  ) {}

  create(createBusrouteDto: CreateBusrouteDto) {
    return this.bus.save(createBusrouteDto);
  }

  findAll() {
    return this.bus.find({ relations: ['busstation'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} busroute`;
  }

  update(id: number, updateBusrouteDto: UpdateBusrouteDto) {
    return `This action updates a #${id} busroute`;
  }

  remove(id: number) {
    return `This action removes a #${id} busroute`;
  }
}
