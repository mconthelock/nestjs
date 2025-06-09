import { Injectable } from '@nestjs/common';
import { CreateF001kpDto } from './dto/create-f001kp.dto';
import { UpdateF001kpDto } from './dto/update-f001kp.dto';

@Injectable()
export class F001kpService {
  create(createF001kpDto: CreateF001kpDto) {
    return 'This action adds a new f001kp';
  }

  findAll() {
    return `This action returns all f001kp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} f001kp`;
  }

  update(id: number, updateF001kpDto: UpdateF001kpDto) {
    return `This action updates a #${id} f001kp`;
  }

  remove(id: number) {
    return `This action removes a #${id} f001kp`;
  }
}
