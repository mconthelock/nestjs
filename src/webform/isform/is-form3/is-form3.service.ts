import { Injectable } from '@nestjs/common';
import { CreateIsForm3Dto } from './dto/create-is-form3.dto';
import { UpdateIsForm3Dto } from './dto/update-is-form3.dto';

@Injectable()
export class IsForm3Service {
  create(createIsForm3Dto: CreateIsForm3Dto) {
    return 'This action adds a new isForm3';
  }

  findAll() {
    return `This action returns all isForm3`;
  }

  findOne(id: number) {
    return `This action returns a #${id} isForm3`;
  }

  update(id: number, updateIsForm3Dto: UpdateIsForm3Dto) {
    return `This action updates a #${id} isForm3`;
  }

  remove(id: number) {
    return `This action removes a #${id} isForm3`;
  }
}
