import { Injectable } from '@nestjs/common';
import { ESCSCreateUserItemStationDto } from './dto/create-user-item-station.dto';
import { ESCSUpdateUserItemStationDto } from './dto/update-user-item-station.dto';

@Injectable()
export class ESCSUserItemStationService {
  create(createUserItemStationDto: ESCSCreateUserItemStationDto) {
    return 'This action adds a new userItemStation';
  }

  findAll() {
    return `This action returns all userItemStation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userItemStation`;
  }

  update(id: number, updateUserItemStationDto: ESCSUpdateUserItemStationDto) {
    return `This action updates a #${id} userItemStation`;
  }

  remove(id: number) {
    return `This action removes a #${id} userItemStation`;
  }
}
