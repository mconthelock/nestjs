import { Injectable } from '@nestjs/common';
import { CreateAemployeeDto } from './dto/create-aemployee.dto';
import { UpdateAemployeeDto } from './dto/update-aemployee.dto';

@Injectable()
export class AemployeeService {
  create(createAemployeeDto: CreateAemployeeDto) {
    return 'This action adds a new aemployee';
  }

  findAll() {
    return `This action returns all aemployee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aemployee`;
  }

  update(id: number, updateAemployeeDto: UpdateAemployeeDto) {
    return `This action updates a #${id} aemployee`;
  }

  remove(id: number) {
    return `This action removes a #${id} aemployee`;
  }
}
