import { Injectable } from '@nestjs/common';
import { CreatePurVendorsCodeDto } from './dto/create-pur_vendors_code.dto';
import { UpdatePurVendorsCodeDto } from './dto/update-pur_vendors_code.dto';

@Injectable()
export class PurVendorsCodeService {
  create(createPurVendorsCodeDto: CreatePurVendorsCodeDto) {
    return 'This action adds a new purVendorsCode';
  }

  findAll() {
    return `This action returns all purVendorsCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purVendorsCode`;
  }

  update(id: number, updatePurVendorsCodeDto: UpdatePurVendorsCodeDto) {
    return `This action updates a #${id} purVendorsCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} purVendorsCode`;
  }
}
