import { Injectable } from '@nestjs/common';
import { CreateFinPckDto } from './dto/create-fin-pck.dto';
import { UpdateFinPckDto } from './dto/update-fin-pck.dto';

@Injectable()
export class FinPckService {
  create(createFinPckDto: CreateFinPckDto) {
    return 'This action adds a new finPck';
  }

  findAll() {
    return `This action returns all finPck`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finPck`;
  }

  update(id: number, updateFinPckDto: UpdateFinPckDto) {
    return `This action updates a #${id} finPck`;
  }

  remove(id: number) {
    return `This action removes a #${id} finPck`;
  }
}
