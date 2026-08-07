import { Injectable } from '@nestjs/common';
import { CreateTurnoverunitDto } from './dto/create-turnoverunit.dto';
import { UpdateTurnoverunitDto } from './dto/update-turnoverunit.dto';

@Injectable()
export class TurnoverunitService {
  create(createTurnoverunitDto: CreateTurnoverunitDto) {
    return 'This action adds a new turnoverunit';
  }

  findAll() {
    return `This action returns all turnoverunit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} turnoverunit`;
  }

  update(id: number, updateTurnoverunitDto: UpdateTurnoverunitDto) {
    return `This action updates a #${id} turnoverunit`;
  }

  remove(id: number) {
    return `This action removes a #${id} turnoverunit`;
  }
}
