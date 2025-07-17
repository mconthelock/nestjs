import { Injectable } from '@nestjs/common';
import { CreateTmaintaintypeDto } from './dto/create-tmaintaintype.dto';
import { UpdateTmaintaintypeDto } from './dto/update-tmaintaintype.dto';

@Injectable()
export class TmaintaintypeService {
  create(createTmaintaintypeDto: CreateTmaintaintypeDto) {
    return 'This action adds a new tmaintaintype';
  }

  findAll() {
    return `This action returns all tmaintaintype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tmaintaintype`;
  }

  update(id: number, updateTmaintaintypeDto: UpdateTmaintaintypeDto) {
    return `This action updates a #${id} tmaintaintype`;
  }

  remove(id: number) {
    return `This action removes a #${id} tmaintaintype`;
  }
}
