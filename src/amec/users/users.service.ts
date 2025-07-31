import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { searchDto } from './dto/search-user.dto';
import { Userts } from './entities/userts.entity';
import { setRepo } from 'src/utils/repo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'amecConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Userts, 'amecConnection')
    private readonly userTsRepository: Repository<Userts>,
  ) {}

  findEmp(empno: string, host: string = '') {
    const repo = setRepo(this.userRepository, this.userTsRepository, host);
    return repo.findOne({
      where: { SEMPNO: empno },
    });
  }

  findEmpEncode(empno: string, host: string = '') {
    const repo = setRepo(this.userRepository, this.userTsRepository, host);
    return repo.findOne({
      where: { SEMPENCODE: empno },
    });
  }

  search(host: string = '') {
    const repo = setRepo(this.userRepository, this.userTsRepository, host);
    return repo.find();
  }
}
