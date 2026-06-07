import { Injectable } from '@nestjs/common';
import { CreateIsOffDto } from './dto/create-is-off.dto';
import { UpdateIsOffDto } from './dto/update-is-off.dto';

@Injectable()
export class IsOffService {
  create(createIsOffDto: CreateIsOffDto) {
    return 'This action adds a new isOff';
  }

  findAll() {
    return `This action returns all isOff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} isOff`;
  }

  update(id: number, updateIsOffDto: UpdateIsOffDto) {
    return `This action updates a #${id} isOff`;
  }

  remove(id: number) {
    return `This action removes a #${id} isOff`;
  }
}
