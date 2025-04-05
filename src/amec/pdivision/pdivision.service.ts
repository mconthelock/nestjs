import { Injectable } from '@nestjs/common';
import { CreatePdivisionDto } from './dto/create-pdivision.dto';
import { UpdatePdivisionDto } from './dto/update-pdivision.dto';

@Injectable()
export class PdivisionService {
  create(createPdivisionDto: CreatePdivisionDto) {
    return 'This action adds a new pdivision';
  }

  findAll() {
    return `This action returns all pdivision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdivision`;
  }

  update(id: number, updatePdivisionDto: UpdatePdivisionDto) {
    return `This action updates a #${id} pdivision`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdivision`;
  }
}
