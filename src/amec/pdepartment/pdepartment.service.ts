import { Injectable } from '@nestjs/common';
import { CreatePdepartmentDto } from './dto/create-pdepartment.dto';
import { UpdatePdepartmentDto } from './dto/update-pdepartment.dto';

@Injectable()
export class PdepartmentService {
  create(createPdepartmentDto: CreatePdepartmentDto) {
    return 'This action adds a new pdepartment';
  }

  findAll() {
    return `This action returns all pdepartment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdepartment`;
  }

  update(id: number, updatePdepartmentDto: UpdatePdepartmentDto) {
    return `This action updates a #${id} pdepartment`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdepartment`;
  }
}
