import { Injectable } from '@nestjs/common';
import { CreateM008kpDto } from './dto/create-m008kp.dto';
import { UpdateM008kpDto } from './dto/update-m008kp.dto';

@Injectable()
export class M008kpService {
  create(createM008kpDto: CreateM008kpDto) {
    return 'This action adds a new m008kp';
  }

  findAll() {
    return `This action returns all m008kp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} m008kp`;
  }

  update(id: number, updateM008kpDto: UpdateM008kpDto) {
    return `This action updates a #${id} m008kp`;
  }

  remove(id: number) {
    return `This action removes a #${id} m008kp`;
  }
}
