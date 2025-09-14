import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appsmenuuser } from './entities/appsmenuuser.entity';
import { CreateAppsmenuuserDto } from './dto/create-appsmenuuser.dto';

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

  getAllUserMenu(program: number) {
    return this.repo.find({
      where: { PROGRAM: program },
      relations: ['Appsmenu'],
      order: { Appsmenu: { MENU_SEQ: 'ASC' } },
    });
  }

  create(data: CreateAppsmenuuserDto) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  remove(appid: number, menuid: number, group: number) {
    return this.repo.delete({
      PROGRAM: appid,
      MENU_ID: menuid,
      USERS_GROUP: group,
    });
  }
}
