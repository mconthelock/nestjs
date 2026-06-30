import { Injectable } from '@nestjs/common';
import { CreateFinpckVwdetailDto } from './dto/create-finpck-vwdetail.dto';
import { UpdateFinpckVwdetailDto } from './dto/update-finpck-vwdetail.dto';
import { VWDetailRepository } from './finpck-vwdetail.repository';

@Injectable()
export class FinpckVwdetailService {
      constructor(
        private readonly repo: VWDetailRepository
    ) {}

  async search(filters: any) {
   return await this.repo.searchData(filters); 
 }
  create(createFinpckVwdetailDto: CreateFinpckVwdetailDto) {
    return 'This action adds a new finpckVwdetail';
  }

  findAll() {
    return `This action returns all finpckVwdetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finpckVwdetail`;
  }

  update(id: number, updateFinpckVwdetailDto: UpdateFinpckVwdetailDto) {
    return `This action updates a #${id} finpckVwdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} finpckVwdetail`;
  }
}
