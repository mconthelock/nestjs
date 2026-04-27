import { Injectable } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';

@Injectable()
export class GpRbService {
  create(createGpRbDto: CreateGpRbDto) {
    return 'This action adds a new gpRb';
  }

  findAll() {
    return `This action returns all gpRb`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gpRb`;
  }

  update(id: number, updateGpRbDto: UpdateGpRbDto) {
    return `This action updates a #${id} gpRb`;
  }

  remove(id: number) {
    return `This action removes a #${id} gpRb`;
  }
}
