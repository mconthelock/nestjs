import { Injectable } from '@nestjs/common';
import { CreateIsMoDto } from './dto/create-is-mo.dto';
import { UpdateIsMoDto } from './dto/update-is-mo.dto';

@Injectable()
export class IsMoService {
  create(createIsMoDto: CreateIsMoDto) {
    return 'This action adds a new isMo';
  }

  findAll() {
    return `This action returns all isMo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} isMo`;
  }

  update(id: number, updateIsMoDto: UpdateIsMoDto) {
    return `This action updates a #${id} isMo`;
  }

  remove(id: number) {
    return `This action removes a #${id} isMo`;
  }
}
