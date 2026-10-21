import { Injectable } from '@nestjs/common';
import { CreateIetsFormDto } from './dto/create-iets_form.dto';
import { UpdateIetsFormDto } from './dto/update-iets_form.dto';

@Injectable()
export class IetsFormService {
  create(createIetsFormDto: CreateIetsFormDto) {
    return 'This action adds a new ietsForm';
  }

  findAll() {
    return `This action returns all ietsForm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ietsForm`;
  }

  update(id: number, updateIetsFormDto: UpdateIetsFormDto) {
    return `This action updates a #${id} ietsForm`;
  }

  remove(id: number) {
    return `This action removes a #${id} ietsForm`;
  }
}
