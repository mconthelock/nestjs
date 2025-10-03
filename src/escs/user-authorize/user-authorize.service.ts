import { Injectable } from '@nestjs/common';
import { ESCSCreateUserAuthorizeDto } from './dto/create-user-authorize.dto';
import { ESCSUpdateUserAuthorizeDto } from './dto/update-user-authorize.dto';

@Injectable()
export class ESCSUserAuthorizeService {
  create(createUserAuthorizeDto: ESCSCreateUserAuthorizeDto) {
    return 'This action adds a new userAuthorize';
  }

  findAll() {
    return `This action returns all userAuthorize`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAuthorize`;
  }

  update(id: number, updateUserAuthorizeDto: ESCSUpdateUserAuthorizeDto) {
    return `This action updates a #${id} userAuthorize`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAuthorize`;
  }
}
