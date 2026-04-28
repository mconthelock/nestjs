import { Injectable } from '@nestjs/common';
import { CreateFinDDto } from './dto/create-fin-d.dto';
import { UpdateFinDDto } from './dto/update-fin-d.dto';

@Injectable()
export class FinDsService {
  create(createFinDDto: CreateFinDDto) {
    return 'This action adds a new finD';
  }

  findAll() {
    return `This action returns all finDs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finD`;
  }

  update(id: number, updateFinDDto: UpdateFinDDto) {
    return `This action updates a #${id} finD`;
  }

  remove(id: number) {
    return `This action removes a #${id} finD`;
  }
}
