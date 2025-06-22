import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'amecConnection')
    private readonly userRepository: Repository<User>,
  ) {}

  findEmp(empno: string) {
    return this.userRepository.findOne({
      where: { SEMPNO: empno },
    });
  }

  findEmpEncode(empno: string) {
    return this.userRepository.findOne({
      where: { SEMPENCODE: empno },
    });
  }

  findByDiv(div: string) {
    return this.userRepository.find({ where: { SDIVCODE: div } });
  }

  findByDept(dep: string) {
    return this.userRepository.find({ where: { SDEPCODE: dep } });
  }

  findBySec(sec: string) {
    return this.userRepository.find({ where: { SSECCODE: sec } });
  }

  findByPos(pos: string) {
    return this.userRepository.find({ where: { SPOSCODE: pos } });
  }
}
