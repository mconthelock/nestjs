import { Injectable } from '@nestjs/common';
import { CreateFormmstDto } from './dto/create-formmst.dto';
import { UpdateFormmstDto } from './dto/update-formmst.dto';

@Injectable()
export class FormmstService {
  create(createFormmstDto: CreateFormmstDto) {
    return 'This action adds a new formmst';
  }

  findAll() {
    return `This action returns all formmst`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formmst`;
  }

  update(id: number, updateFormmstDto: UpdateFormmstDto) {
    return `This action updates a #${id} formmst`;
  }

  remove(id: number) {
    return `This action removes a #${id} formmst`;
  }
}
