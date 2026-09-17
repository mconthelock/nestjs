import { Injectable } from '@nestjs/common';
import { CreateQaCnDto } from './dto/create-qa-cn.dto';
import { UpdateQaCnDto } from './dto/update-qa-cn.dto';

@Injectable()
export class QaCnService {
  create(createQaCnDto: CreateQaCnDto) {
    return 'This action adds a new qaCn';
  }

  findAll() {
    return `This action returns all qaCn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qaCn`;
  }

  update(id: number, updateQaCnDto: UpdateQaCnDto) {
    return `This action updates a #${id} qaCn`;
  }

  remove(id: number) {
    return `This action removes a #${id} qaCn`;
  }
}
