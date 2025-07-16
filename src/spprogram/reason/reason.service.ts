import { Injectable } from '@nestjs/common';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';

@Injectable()
export class ReasonService {
  create(createReasonDto: CreateReasonDto) {
    return 'This action adds a new reason';
  }

  findAll() {
    return `This action returns all reason`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reason`;
  }

  update(id: number, updateReasonDto: UpdateReasonDto) {
    return `This action updates a #${id} reason`;
  }

  remove(id: number) {
    return `This action removes a #${id} reason`;
  }
}
