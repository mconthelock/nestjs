import { Injectable } from '@nestjs/common';
import { CreateMfgVtrDto } from './dto/create-mfg-vtr.dto';
import { UpdateMfgVtrDto } from './dto/update-mfg-vtr.dto';

@Injectable()
export class MfgVtrService {
  create(createMfgVtrDto: CreateMfgVtrDto) {
    return 'This action adds a new mfgVtr';
  }

  findAll() {
    return `This action returns all mfgVtr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mfgVtr`;
  }

  update(id: number, updateMfgVtrDto: UpdateMfgVtrDto) {
    return `This action updates a #${id} mfgVtr`;
  }

  remove(id: number) {
    return `This action removes a #${id} mfgVtr`;
  }
}
