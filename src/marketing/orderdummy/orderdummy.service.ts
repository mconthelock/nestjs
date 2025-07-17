import { Injectable } from '@nestjs/common';
import { CreateOrderdummyDto } from './dto/create-orderdummy.dto';
import { UpdateOrderdummyDto } from './dto/update-orderdummy.dto';

@Injectable()
export class OrderdummyService {
  create(createOrderdummyDto: CreateOrderdummyDto) {
    return 'This action adds a new orderdummy';
  }

  findAll() {
    return `This action returns all orderdummy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderdummy`;
  }

  update(id: number, updateOrderdummyDto: UpdateOrderdummyDto) {
    return `This action updates a #${id} orderdummy`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderdummy`;
  }
}
