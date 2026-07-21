import { Injectable } from '@nestjs/common';
import { CreatePurEvaDto } from './dto/create-pur-eva.dto';
import { UpdatePurEvaDto } from './dto/update-pur-eva.dto';

@Injectable()
export class PurEvaService {
  create(createPurEvaDto: CreatePurEvaDto) {
    return 'This action adds a new purEva';
  }

  findAll() {
    return `This action returns all purEva`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purEva`;
  }

  update(id: number, updatePurEvaDto: UpdatePurEvaDto) {
    return `This action updates a #${id} purEva`;
  }

  remove(id: number) {
    return `This action removes a #${id} purEva`;
  }
}
