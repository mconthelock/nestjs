import { Injectable } from '@nestjs/common';
import { CreateIsAdpDto } from './dto/create-is-adp.dto';
import { UpdateIsAdpDto } from './dto/update-is-adp.dto';

@Injectable()
export class IsAdpService {
  create(createIsAdpDto: CreateIsAdpDto) {
    return 'This action adds a new isAdp';
  }

  findAll() {
    return `This action returns all isAdp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} isAdp`;
  }

  update(id: number, updateIsAdpDto: UpdateIsAdpDto) {
    return `This action updates a #${id} isAdp`;
  }

  remove(id: number) {
    return `This action removes a #${id} isAdp`;
  }
}
