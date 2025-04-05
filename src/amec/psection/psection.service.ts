import { Injectable } from '@nestjs/common';
import { CreatePsectionDto } from './dto/create-psection.dto';
import { UpdatePsectionDto } from './dto/update-psection.dto';

@Injectable()
export class PsectionService {
  create(createPsectionDto: CreatePsectionDto) {
    return 'This action adds a new psection';
  }

  findAll() {
    return `This action returns all psection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} psection`;
  }

  update(id: number, updatePsectionDto: UpdatePsectionDto) {
    return `This action updates a #${id} psection`;
  }

  remove(id: number) {
    return `This action removes a #${id} psection`;
  }
}
