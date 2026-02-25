import { Injectable } from '@nestjs/common';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchOvertimeDto } from './dto/search-overtime.dto';
import { Overtime } from 'src/common/Entities/gpreport/table/overtime.entity';

@Injectable()
export class OvertimeService {
  constructor(
  @InjectRepository(Overtime, 'gpreportConnection')
  private readonly otRepo: Repository<Overtime>,
) {}

 
  create(createOvertimeDto: CreateOvertimeDto) {
    return 'This action adds a new overtime';
  }
  

  async findAll(q: SearchOvertimeDto) {
    return await this.otRepo.find({ where: q });
  }



  findOne(id: number) {
    return `This action returns a #${id} overtime`;
  }

  update(id: number, updateOvertimeDto: UpdateOvertimeDto) {
    return `This action updates a #${id} overtime`;
  }

  remove(id: number) {
    return `This action removes a #${id} overtime`;
  }
}
