import { Injectable } from '@nestjs/common';
import { CreateOrderpartDto } from './dto/create-orderpart.dto';
import { UpdateOrderpartDto } from './dto/update-orderpart.dto';

@Injectable()
export class OrderpartsService {
  create(createOrderpartDto: CreateOrderpartDto) {
    return 'This action adds a new orderpart';
  }

  findAll() {
    return `This action returns all orderparts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderpart`;
  }

  update(id: number, updateOrderpartDto: UpdateOrderpartDto) {
    return `This action updates a #${id} orderpart`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderpart`;
  }
}
