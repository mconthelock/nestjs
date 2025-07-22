import { Injectable } from '@nestjs/common';
import { CreateQaTypeDto } from './dto/create-qa_type.dto';
import { UpdateQaTypeDto } from './dto/update-qa_type.dto';

@Injectable()
export class QaTypeService {
  create(createQaTypeDto: CreateQaTypeDto) {
    return 'This action adds a new qaType';
  }

  findAll() {
    return `This action returns all qaType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qaType`;
  }

  update(id: number, updateQaTypeDto: UpdateQaTypeDto) {
    return `This action updates a #${id} qaType`;
  }

  remove(id: number) {
    return `This action removes a #${id} qaType`;
  }
}
