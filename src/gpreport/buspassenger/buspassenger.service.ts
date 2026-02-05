import { Buspassenger } from './entities/buspassenger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateBuspassengerDto } from './dto/create-buspassenger.dto';
import { UpdateBuspassengerDto } from './dto/update-buspassenger.dto';

@Injectable()
export class BuspassengerService {
  constructor(
    @InjectRepository(Buspassenger, 'gpreportConnection')
    private readonly buspassengerRepository: Repository<Buspassenger>,
  ) {}

  create(createBuspassengerDto: CreateBuspassengerDto) {
    return this.buspassengerRepository.save(createBuspassengerDto);
  }

  findAll() {
    return `This action returns all buspassenger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buspassenger`;
  }

  update(id: number, updateBuspassengerDto: UpdateBuspassengerDto) {
    return `This action updates a #${id} buspassenger`;
  }

  remove(id: number) {
    return `This action removes a #${id} buspassenger`;
  }
}
