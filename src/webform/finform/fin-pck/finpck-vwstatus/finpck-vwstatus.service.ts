import { Injectable } from '@nestjs/common';
import { CreateFinpckVwstatusDto } from './dto/create-finpck-vwstatus.dto';
import { UpdateFinpckVwstatusDto } from './dto/update-finpck-vwstatus.dto';
import { VWStatusRepository } from './finpck-vwstatus.repository';

@Injectable()
export class FinpckVwstatusService {
      constructor(
          private readonly repo: VWStatusRepository
  ) {}

  async search(filters: any) {
   return await this.repo.searchData(filters); 
 }
  create(createFinpckVwstatusDto: CreateFinpckVwstatusDto) {
    return 'This action adds a new finpckVwstatus';
  }

  findAll() {
    return `This action returns all finpckVwstatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finpckVwstatus`;
  }

  update(id: number, updateFinpckVwstatusDto: UpdateFinpckVwstatusDto) {
    return `This action updates a #${id} finpckVwstatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} finpckVwstatus`;
  }
}
