import { Injectable } from '@nestjs/common';
import { CreatePurnvfListDto } from './dto/create-purnvf_list.dto';
import { UpdatePurnvfListDto } from './dto/update-purnvf_list.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurnvfListRepository } from './purnvf_list.repository';

@Injectable()
export class PurnvfListService {
  constructor(private readonly repo: PurnvfListRepository) {}

  async create(dto: CreatePurnvfListDto) {
          try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert PURVNFLIST');
            }
            return {
                status: true,
                message: 'Insert PURVNFLIST Successfully',
            };
        } catch (error) {
            throw new Error('Insert PURVNFLIST Error: ' + error.message);
        }

  }

  findAll() {
    return `This action returns all purnvfList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purnvfList`;
  }

  update(id: number, updatePurnvfListDto: UpdatePurnvfListDto) {
    return `This action updates a #${id} purnvfList`;
  }

  remove(id: number) {
    return `This action removes a #${id} purnvfList`;
  }
}
