import { Injectable } from '@nestjs/common';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';

@Injectable()
export class JobOrderService {
  create(createJobOrderDto: CreateJobOrderDto) {
    return 'This action adds a new jobOrder';
  }

  findAll() {
    return `This action returns all jobOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobOrder`;
  }

  update(id: number, updateJobOrderDto: UpdateJobOrderDto) {
    return `This action updates a #${id} jobOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobOrder`;
  }
}
