import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { searchDto } from './dto/search-user.dto';
// import { setRepo } from 'src/utils/repo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'amecConnection')
    private readonly userRepository: Repository<User>,
  ) {}

  findEmp(empno: string, host: string = '') {
    //   const repo = setRepo(this.userRepository, host);
    //   return repo.findOne({
    //     where: { SEMPNO: empno },
    //   });
    return null;
  }

  findEmpEncode(empno: string, host: string = '') {
    //   const repo = setRepo(this.userRepository, host);
    //   return repo.findOne({
    //     where: { SEMPENCODE: empno },
    //   });
    return null;
  }

  search(host: string = '') {
    //   const repo = setRepo(this.userRepository, host);
    //   return repo.find();
    return null;
  }
}
