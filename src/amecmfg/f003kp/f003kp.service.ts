import { Injectable } from '@nestjs/common';
import { CreateF003kpDto } from './dto/create-f003kp.dto';
import { UpdateF003kpDto } from './dto/update-f003kp.dto';

@Injectable()
export class F003kpService {
  create(createF003kpDto: CreateF003kpDto) {
    return 'This action adds a new f003kp';
  }

  findAll() {
    return `This action returns all f003kp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} f003kp`;
  }

  update(id: number, updateF003kpDto: UpdateF003kpDto) {
    return `This action updates a #${id} f003kp`;
  }

  remove(id: number) {
    return `This action removes a #${id} f003kp`;
  }
}
