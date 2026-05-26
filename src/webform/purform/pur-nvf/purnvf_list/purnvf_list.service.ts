import { Injectable } from '@nestjs/common';
import { CreatePurnvfListDto } from './dto/create-purnvf_list.dto';
import { UpdatePurnvfListDto } from './dto/update-purnvf_list.dto';

@Injectable()
export class PurnvfListService {
  create(createPurnvfListDto: CreatePurnvfListDto) {
    return 'This action adds a new purnvfList';
  }

  findAll() {
    return `This action returns all purnvfList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purnvfList`;
  }

  update(id: number, updatePurnvfListDto: UpdatePurnvfListDto) {
    return `This action updates a #${id} purnvfList`;
  }

  remove(id: number) {
    return `This action removes a #${id} purnvfList`;
  }
}
