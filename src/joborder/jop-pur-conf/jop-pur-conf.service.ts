import { Injectable } from '@nestjs/common';
import { CreateJopPurConfDto } from './dto/create-jop-pur-conf.dto';
import { UpdateJopPurConfDto } from './dto/update-jop-pur-conf.dto';

@Injectable()
export class JopPurConfService {
  create(createJopPurConfDto: CreateJopPurConfDto) {
    return 'This action adds a new jopPurConf';
  }

  findAll() {
    return `This action returns all jopPurConf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jopPurConf`;
  }

  update(id: number, updateJopPurConfDto: UpdateJopPurConfDto) {
    return `This action updates a #${id} jopPurConf`;
  }

  remove(id: number) {
    return `This action removes a #${id} jopPurConf`;
  }
}
