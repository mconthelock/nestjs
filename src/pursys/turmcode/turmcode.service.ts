import { Injectable } from '@nestjs/common';
import { CreateTurmcodeDto } from './dto/create-turmcode.dto';
import { UpdateTurmcodeDto } from './dto/update-turmcode.dto';

@Injectable()
export class TurmcodeService {
  create(createTurmcodeDto: CreateTurmcodeDto) {
    return 'This action adds a new turmcode';
  }

  findAll() {
    return `This action returns all turmcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} turmcode`;
  }

  update(id: number, updateTurmcodeDto: UpdateTurmcodeDto) {
    return `This action updates a #${id} turmcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} turmcode`;
  }
}
