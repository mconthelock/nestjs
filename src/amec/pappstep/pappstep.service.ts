import { Injectable } from '@nestjs/common';
import { CreatePappstepDto } from './dto/create-pappstep.dto';
import { UpdatePappstepDto } from './dto/update-pappstep.dto';

@Injectable()
export class PappstepService {
  create(createPappstepDto: CreatePappstepDto) {
    return 'This action adds a new pappstep';
  }

  findAll() {
    return `This action returns all pappstep`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pappstep`;
  }

  update(id: number, updatePappstepDto: UpdatePappstepDto) {
    return `This action updates a #${id} pappstep`;
  }

  remove(id: number) {
    return `This action removes a #${id} pappstep`;
  }
}
