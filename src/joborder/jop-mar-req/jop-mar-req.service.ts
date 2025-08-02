import { Injectable } from '@nestjs/common';
import { CreateJopMarReqDto } from './dto/create-jop-mar-req.dto';
import { UpdateJopMarReqDto } from './dto/update-jop-mar-req.dto';

@Injectable()
export class JopMarReqService {
  create(createJopMarReqDto: CreateJopMarReqDto) {
    return 'This action adds a new jopMarReq';
  }

  findAll() {
    return `This action returns all jopMarReq`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jopMarReq`;
  }

  update(id: number, updateJopMarReqDto: UpdateJopMarReqDto) {
    return `This action updates a #${id} jopMarReq`;
  }

  remove(id: number) {
    return `This action removes a #${id} jopMarReq`;
  }
}
