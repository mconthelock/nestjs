import { Injectable } from '@nestjs/common';
import { CreateF002kpDto } from './dto/create-f002kp.dto';
import { UpdateF002kpDto } from './dto/update-f002kp.dto';

@Injectable()
export class F002kpService {
  create(createF002kpDto: CreateF002kpDto) {
    return 'This action adds a new f002kp';
  }

  findAll() {
    return `This action returns all f002kp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} f002kp`;
  }

  update(id: number, updateF002kpDto: UpdateF002kpDto) {
    return `This action updates a #${id} f002kp`;
  }

  remove(id: number) {
    return `This action removes a #${id} f002kp`;
  }
}
