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
      where: { sempno: empno },
    });
  }

  findByDiv(div: string) {
    return this.userRepository.find({ where: { sdivcode: div } });
  }

  findByDept(dep: string) {
    return this.userRepository.find({ where: { sdepcode: dep } });
  }

  findBySec(sec: string) {
    return this.userRepository.find({ where: { sseccode: sec } });
  }

  findByPos(pos: string) {
    return this.userRepository.find({ where: { sposcode: pos } });
  }
}
