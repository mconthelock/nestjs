import { Injectable } from '@nestjs/common';
import { CreateStyImageDto } from './dto/create-sty-image.dto';
import { UpdateStyImageDto } from './dto/update-sty-image.dto';

@Injectable()
export class StyImageService {
  create(createStyImageDto: CreateStyImageDto) {
    return 'This action adds a new styImage';
  }

  findAll() {
    return `This action returns all styImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} styImage`;
  }

  update(id: number, updateStyImageDto: UpdateStyImageDto) {
    return `This action updates a #${id} styImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} styImage`;
  }
}
