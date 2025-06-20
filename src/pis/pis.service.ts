import { Injectable } from '@nestjs/common';
import { CreatePiDto } from './dto/create-pi.dto';
import { UpdatePiDto } from './dto/update-pi.dto';

@Injectable()
export class PisService {
<<<<<<< HEAD
=======
  create(createPiDto: CreatePiDto) {
    return 'This action adds a new pi';
  }

  findAll() {
    return `This action returns all pis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pi`;
  }

  update(id: number, updatePiDto: UpdatePiDto) {
    return `This action updates a #${id} pi`;
  }

  remove(id: number) {
    return `This action removes a #${id} pi`;
  }
>>>>>>> b3479b8846c753c0de13c0fb9cae2625a82670ac
}
