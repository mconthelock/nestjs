import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'webformConnection')
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

  search() {
    return this.userRepository.find();
  }
}
