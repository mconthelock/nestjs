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

  findBirthday(month: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where("cstatus = '1' and sposcode < 80 and birthday is not null and SUBSTR(birthday, 5, 2) = :month", { month })
      .orderBy('birthday')
      .getMany();
  }
}
