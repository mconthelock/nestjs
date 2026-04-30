import { Injectable } from '@nestjs/common';
import { CreateStyPatrolDto } from './dto/create-sty-patrol.dto';
import { UpdateStyPatrolDto } from './dto/update-sty-patrol.dto';

@Injectable()
export class StyPatrolService {
  create(createStyPatrolDto: CreateStyPatrolDto) {
    return 'This action adds a new styPatrol';
  }

  findAll() {
    return `This action returns all styPatrol`;
  }

  findOne(id: number) {
    return `This action returns a #${id} styPatrol`;
  }

  update(id: number, updateStyPatrolDto: UpdateStyPatrolDto) {
    return `This action updates a #${id} styPatrol`;
  }

  remove(id: number) {
    return `This action removes a #${id} styPatrol`;
  }
}
