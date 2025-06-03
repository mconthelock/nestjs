import { Injectable } from '@nestjs/common';
import { CreateAppsmenuDto } from './dto/create-appsmenu.dto';
import { UpdateAppsmenuDto } from './dto/update-appsmenu.dto';

@Injectable()
export class AppsmenuService {
  create(createAppsmenuDto: CreateAppsmenuDto) {
    return 'This action adds a new appsmenu';
  }

  findAll() {
    return `This action returns all appsmenu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appsmenu`;
  }

  update(id: number, updateAppsmenuDto: UpdateAppsmenuDto) {
    return `This action updates a #${id} appsmenu`;
  }

  remove(id: number) {
    return `This action removes a #${id} appsmenu`;
  }
}
