import { Injectable } from '@nestjs/common';
import { CreatePurnvfAddressDto } from './dto/create-purnvf_address.dto';
import { UpdatePurnvfAddressDto } from './dto/update-purnvf_address.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurnvfAddressRepository } from './purnvf_address.repository';

@Injectable()
export class PurnvfAddressService {
  constructor(private readonly repo: PurnvfAddressRepository) {}

 async create(dto: CreatePurnvfAddressDto) {
      try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert PURVNFADDRESS');
            }
            return {
                status: true,
                message: 'Insert PURVNFADDRESS Successfully',
            };
        } catch (error) {
            throw new Error('Insert PURVNFADDRESS Error: ' + error.message);
        }
  }
  findAll() {
    return `This action returns all purnvfAddress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purnvfAddress`;
  }

  update(id: number, updatePurnvfAddressDto: UpdatePurnvfAddressDto) {
    return `This action updates a #${id} purnvfAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} purnvfAddress`;
  }
}
