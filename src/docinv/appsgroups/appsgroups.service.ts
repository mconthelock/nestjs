import { Injectable } from '@nestjs/common';
import { CreateAppsgroupDto } from './dto/create-appsgroup.dto';
import { UpdateAppsgroupDto } from './dto/update-appsgroup.dto';

@Injectable()
export class AppsgroupsService {
  create(createAppsgroupDto: CreateAppsgroupDto) {
    return 'This action adds a new appsgroup';
  }

  findAll() {
    return `This action returns all appsgroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appsgroup`;
  }

  update(id: number, updateAppsgroupDto: UpdateAppsgroupDto) {
    return `This action updates a #${id} appsgroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} appsgroup`;
  }
}
