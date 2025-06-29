import { Injectable } from '@nestjs/common';
import { CreateIsForm4Dto } from './dto/create-is-form4.dto';
import { UpdateIsForm4Dto } from './dto/update-is-form4.dto';

@Injectable()
export class IsForm4Service {
  create(createIsForm4Dto: CreateIsForm4Dto) {
    return 'This action adds a new isForm4';
  }

  findAll() {
    return `This action returns all isForm4`;
  }

  findOne(id: number) {
    return `This action returns a #${id} isForm4`;
  }

  update(id: number, updateIsForm4Dto: UpdateIsForm4Dto) {
    return `This action updates a #${id} isForm4`;
  }

  remove(id: number) {
    return `This action removes a #${id} isForm4`;
  }
}
