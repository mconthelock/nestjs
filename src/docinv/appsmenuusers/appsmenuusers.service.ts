import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appsmenuuser } from './entities/appsmenuuser.entity';

@Injectable()
export class AppsmenuusersService {
  constructor(
    @InjectRepository(Appsmenuuser, 'docinvConnection')
    private readonly repo: Repository<Appsmenuuser>,
  ) {}

  getUserMenu(program: number, group: number) {
    return this.repo.find({
      where: { USERS_GROUP: group, PROGRAM: program },
      relations: ['Appsmenu'],
      order: { Appsmenu: { MENU_SEQ: 'ASC' } },
    });
  }
}
