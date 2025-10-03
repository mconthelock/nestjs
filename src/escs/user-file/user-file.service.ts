import { Injectable } from '@nestjs/common';
import { ESCSCreateUserFileDto } from './dto/create-user-file.dto';
import { ESCSUpdateUserFileDto } from './dto/update-user-file.dto';

@Injectable()
export class ESCSUserFileService {
  create(createUserFileDto: ESCSCreateUserFileDto) {
    return 'This action adds a new userFile';
  }

  findAll() {
    return `This action returns all userFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFile`;
  }

  update(id: number, updateUserFileDto: ESCSUpdateUserFileDto) {
    return `This action updates a #${id} userFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFile`;
  }
}
