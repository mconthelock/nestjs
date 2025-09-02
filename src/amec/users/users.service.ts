import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'amecConnection')
    private readonly userRepository: Repository<User>,
  ) {}

  findEmp(empno: string, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(User)
      : this.userRepository;
    return repo.findOne({
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
