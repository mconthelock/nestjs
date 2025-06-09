import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appsmenuuser } from './entities/appsmenuuser.entity';

@Injectable()
export class AppsmenuusersService {
  constructor(
    @InjectRepository(Appsmenuuser, 'amecConnection')
    private readonly repo: Repository<Appsmenuuser>,
  ) {}
  getByGroup(program: number, group: number) {
    return this.repo.find({
      where: { USERS_GROUP: group, PROGRAM: program },
      relations: ['Appsmenu'],
    });
  }
}
