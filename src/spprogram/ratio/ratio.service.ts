import { Injectable } from '@nestjs/common';
import { CreateRatioDto } from './dto/create-ratio.dto';
import { UpdateRatioDto } from './dto/update-ratio.dto';

@Injectable()
export class RatioService {
  create(createRatioDto: CreateRatioDto) {
    return 'This action adds a new ratio';
  }

  findAll() {
    return `This action returns all ratio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ratio`;
  }

  update(id: number, updateRatioDto: UpdateRatioDto) {
    return `This action updates a #${id} ratio`;
  }

  remove(id: number) {
    return `This action removes a #${id} ratio`;
  }
}
