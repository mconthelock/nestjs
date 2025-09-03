import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AEmployee } from './entities/aemployee.entity';
import { CreateAemployeeDto } from './dto/create-aemployee.dto';
import { UpdateAemployeeDto } from './dto/update-aemployee.dto';

@Injectable()
export class AemployeeService {
  constructor(
    @InjectRepository(AEmployee, 'webformConnection')
    private readonly aemployeeRepository: Repository<AEmployee>,
  ) {}

  async create(createAemployeeDto: CreateAemployeeDto) {
    const aemployee = this.aemployeeRepository.create(createAemployeeDto);
    const result = await this.aemployeeRepository.save(aemployee);
    return result;
  }

  findAll() {
    return this.aemployeeRepository.find();
  }

  async findOne(id: string) {
    const user = await this.aemployeeRepository.findOne({
      where: { sempno: id },
    });
    return user;
  }

  async findOneBySLogin(id: string) {
    const user = await this.aemployeeRepository.findOne({
      where: { sempno: id },
      select: [
        'sempno',
        'sname',
        'sdivcode',
        'sdepcode',
        'sseccode',
        'sposcode',
        'spassword1',
      ],
    });
    return user;
  }

  update(id: number, updateAemployeeDto: UpdateAemployeeDto) {
    return `This action updates a #${id} aemployee`;
  }

  remove(id: number) {
    return `This action removes a #${id} aemployee`;
  }
}
