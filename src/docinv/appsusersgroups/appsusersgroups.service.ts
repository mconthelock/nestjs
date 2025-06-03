import { Injectable } from '@nestjs/common';
import { CreateAppsusersgroupDto } from './dto/create-appsusersgroup.dto';
import { UpdateAppsusersgroupDto } from './dto/update-appsusersgroup.dto';

@Injectable()
export class AppsusersgroupsService {
  create(createAppsusersgroupDto: CreateAppsusersgroupDto) {
    return 'This action adds a new appsusersgroup';
  }

  findAll() {
    return `This action returns all appsusersgroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appsusersgroup`;
  }

  update(id: number, updateAppsusersgroupDto: UpdateAppsusersgroupDto) {
    return `This action updates a #${id} appsusersgroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} appsusersgroup`;
  }
}
