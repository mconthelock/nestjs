import { Injectable } from '@nestjs/common';
import { CreateQ90010p2Dto } from './dto/create-q90010p2.dto';
import { UpdateQ90010p2Dto } from './dto/update-q90010p2.dto';

@Injectable()
export class Q90010p2Service {
  create(createQ90010p2Dto: CreateQ90010p2Dto) {
    return 'This action adds a new q90010p2';
  }

  findAll() {
    return `This action returns all q90010p2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} q90010p2`;
  }

  update(id: number, updateQ90010p2Dto: UpdateQ90010p2Dto) {
    return `This action updates a #${id} q90010p2`;
  }

  remove(id: number) {
    return `This action removes a #${id} q90010p2`;
  }
}
