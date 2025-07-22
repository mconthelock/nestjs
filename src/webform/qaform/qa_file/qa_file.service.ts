import { Injectable } from '@nestjs/common';
import { CreateQaFileDto } from './dto/create-qa_file.dto';
import { UpdateQaFileDto } from './dto/update-qa_file.dto';

@Injectable()
export class QaFileService {
  create(createQaFileDto: CreateQaFileDto) {
    return 'This action adds a new qaFile';
  }

  findAll() {
    return `This action returns all qaFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qaFile`;
  }

  update(id: number, updateQaFileDto: UpdateQaFileDto) {
    return `This action updates a #${id} qaFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} qaFile`;
  }
}
