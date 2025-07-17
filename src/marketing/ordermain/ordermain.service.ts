import { Injectable } from '@nestjs/common';
import { CreateOrdermainDto } from './dto/create-ordermain.dto';
import { UpdateOrdermainDto } from './dto/update-ordermain.dto';

@Injectable()
export class OrdermainService {
  create(createOrdermainDto: CreateOrdermainDto) {
    return 'This action adds a new ordermain';
  }

  findAll() {
    return `This action returns all ordermain`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordermain`;
  }

  update(id: number, updateOrdermainDto: UpdateOrdermainDto) {
    return `This action updates a #${id} ordermain`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordermain`;
  }
}
