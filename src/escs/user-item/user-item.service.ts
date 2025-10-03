import { Injectable } from '@nestjs/common';
import { ESCSCreateUserItemDto } from './dto/create-user-item.dto';
import { ESCSUpdateUserItemDto } from './dto/update-user-item.dto';

@Injectable()
export class ESCSUserItemService {
  create(createUserItemDto: ESCSCreateUserItemDto) {
    return 'This action adds a new userItem';
  }

  findAll() {
    return `This action returns all userItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userItem`;
  }

  update(id: number, updateUserItemDto: ESCSUpdateUserItemDto) {
    return `This action updates a #${id} userItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} userItem`;
  }
}
