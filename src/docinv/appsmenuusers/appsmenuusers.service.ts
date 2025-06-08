import { Injectable } from '@nestjs/common';
import { CreateAppsmenuuserDto } from './dto/create-appsmenuuser.dto';
import { UpdateAppsmenuuserDto } from './dto/update-appsmenuuser.dto';

@Injectable()
export class AppsmenuusersService {
  create(createAppsmenuuserDto: CreateAppsmenuuserDto) {
    return 'This action adds a new appsmenuuser';
  }

  findAll() {
    return `This action returns all appsmenuusers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appsmenuuser`;
  }

  update(id: number, updateAppsmenuuserDto: UpdateAppsmenuuserDto) {
    return `This action updates a #${id} appsmenuuser`;
  }

  remove(id: number) {
    return `This action removes a #${id} appsmenuuser`;
  }
}
