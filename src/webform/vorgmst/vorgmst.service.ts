import { Injectable } from '@nestjs/common';
import { CreateVorgmstDto } from './dto/create-vorgmst.dto';
import { UpdateVorgmstDto } from './dto/update-vorgmst.dto';

@Injectable()
export class VorgmstService {
  create(createVorgmstDto: CreateVorgmstDto) {
    return 'This action adds a new vorgmst';
  }

  findAll() {
    return `This action returns all vorgmst`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vorgmst`;
  }

  update(id: number, updateVorgmstDto: UpdateVorgmstDto) {
    return `This action updates a #${id} vorgmst`;
  }

  remove(id: number) {
    return `This action removes a #${id} vorgmst`;
  }
}
