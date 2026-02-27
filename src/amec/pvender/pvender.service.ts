import { Injectable } from '@nestjs/common';
import { CreatePvenderDto } from './dto/create-pvender.dto';
import { UpdatePvenderDto } from './dto/update-pvender.dto';

@Injectable()
export class PvenderService {
  create(createPvenderDto: CreatePvenderDto) {
    return 'This action adds a new pvender';
  }

  findAll() {
    return `This action returns all pvender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pvender`;
  }

  update(id: number, updatePvenderDto: UpdatePvenderDto) {
    return `This action updates a #${id} pvender`;
  }

  remove(id: number) {
    return `This action removes a #${id} pvender`;
  }
}
