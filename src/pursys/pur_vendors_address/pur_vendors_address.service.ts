import { Injectable } from '@nestjs/common';
import { CreatePurVendorsAddressDto } from './dto/create-pur_vendors_address.dto';
import { UpdatePurVendorsAddressDto } from './dto/update-pur_vendors_address.dto';

@Injectable()
export class PurVendorsAddressService {
  create(createPurVendorsAddressDto: CreatePurVendorsAddressDto) {
    return 'This action adds a new purVendorsAddress';
  }

  findAll() {
    return `This action returns all purVendorsAddress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purVendorsAddress`;
  }

  update(id: number, updatePurVendorsAddressDto: UpdatePurVendorsAddressDto) {
    return `This action updates a #${id} purVendorsAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} purVendorsAddress`;
  }
}
