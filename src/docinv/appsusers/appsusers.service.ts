import { Injectable } from '@nestjs/common';
import { CreateAppsuserDto } from './dto/create-appsuser.dto';
import { UpdateAppsuserDto } from './dto/update-appsuser.dto';

@Injectable()
export class AppsusersService {
  create(createAppsuserDto: CreateAppsuserDto) {
    return 'This action adds a new appsuser';
  }

  findAll() {
    return `This action returns all appsusers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appsuser`;
  }

  update(id: number, updateAppsuserDto: UpdateAppsuserDto) {
    return `This action updates a #${id} appsuser`;
  }

  remove(id: number) {
    return `This action removes a #${id} appsuser`;
  }
}
