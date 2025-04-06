import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AEmployee } from './entities/aemployee.entity';
import { CreateAemployeeDto } from './dto/create-aemployee.dto';
import { UpdateAemployeeDto } from './dto/update-aemployee.dto';

@Injectable()
export class AemployeeService {
  constructor(
    @InjectRepository(AEmployee, 'amecConnection')
    private readonly aemployeeRepository: Repository<AEmployee>,
  ) {}

  async create(createAemployeeDto: CreateAemployeeDto) {
    const aemployee = this.aemployeeRepository.create(createAemployeeDto);
    const result = await this.aemployeeRepository.save(aemployee);
    return result;
  }

  findAll() {
    return `This action returns all aemployee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aemployee`;
  }

  update(id: number, updateAemployeeDto: UpdateAemployeeDto) {
    return `This action updates a #${id} aemployee`;
  }

  remove(id: number) {
    return `This action removes a #${id} aemployee`;
  }
}
