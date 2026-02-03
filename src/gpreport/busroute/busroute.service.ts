import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Busroute } from './entities/busroute.entity';
import { CreateBusrouteDto } from './dto/create-busroute.dto';
import { UpdateBusrouteDto } from './dto/update-busroute.dto';

@Injectable()
export class BusrouteService {
  constructor(
    @InjectRepository(Busroute, 'amecConnection')
    private readonly busrouteRepository: Repository<Busroute>,
  ) {}

  create(createBusrouteDto: CreateBusrouteDto) {
    return this.busrouteRepository.save(createBusrouteDto);
  }

  findAll() {
    return `This action returns all busroute`;
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
