import { Injectable } from '@nestjs/common';
import { CreatePurVendorsAttfileDto } from './dto/create-pur_vendors_attfile.dto';
import { UpdatePurVendorsAttfileDto } from './dto/update-pur_vendors_attfile.dto';

@Injectable()
export class PurVendorsAttfileService {
  create(createPurVendorsAttfileDto: CreatePurVendorsAttfileDto) {
    return 'This action adds a new purVendorsAttfile';
  }

  findAll() {
    return `This action returns all purVendorsAttfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purVendorsAttfile`;
  }

  update(id: number, updatePurVendorsAttfileDto: UpdatePurVendorsAttfileDto) {
    return `This action updates a #${id} purVendorsAttfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} purVendorsAttfile`;
  }
}
