import { Injectable } from '@nestjs/common';
import { CreateFinDDto } from './dto/create-fin-d.dto';
import { UpdateFinDDto } from './dto/update-fin-d.dto';
import { FinDsRepository } from './fin-ds.repository';

@Injectable()
export class FinDsService {
  constructor(
    private readonly repo: FinDsRepository
  ) {}
  
  create(createFinDDto: CreateFinDDto) {
    return 'This action adds a new finD';


  }

  findAll() {
    return this.repo.findall();
    }

  // findOne(id: number) {
  //   return `This action returns a #${id} finD`;
  // }

  // update(id: number, updateFinDDto: UpdateFinDDto) {
  //   return `This action updates a #${id} finD`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} finD`;
  // }
}
