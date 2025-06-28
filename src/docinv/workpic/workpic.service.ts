import { Injectable } from '@nestjs/common';
import { CreateWorkpicDto } from './dto/create-workpic.dto';
import { UpdateWorkpicDto } from './dto/update-workpic.dto';

@Injectable()
export class WorkpicService {
  create(createWorkpicDto: CreateWorkpicDto) {
    return 'This action adds a new workpic';
  }

  findAll() {
    return `This action returns all workpic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workpic`;
  }

  update(id: number, updateWorkpicDto: UpdateWorkpicDto) {
    return `This action updates a #${id} workpic`;
  }

  remove(id: number) {
    return `This action removes a #${id} workpic`;
  }
}
