import { Injectable } from '@nestjs/common';
import { CreateGpOtDto } from './dto/create-gp-ot.dto';
import { UpdateGpOtDto } from './dto/update-gp-ot.dto';

@Injectable()
export class GpOtService {
  create(createGpOtDto: CreateGpOtDto) {
    return 'This action adds a new gpOt';
  }

  findAll() {
    return `This action returns all gpOt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gpOt`;
  }

  update(id: number, updateGpOtDto: UpdateGpOtDto) {
    return `This action updates a #${id} gpOt`;
  }

  remove(id: number) {
    return `This action removes a #${id} gpOt`;
  }
}
