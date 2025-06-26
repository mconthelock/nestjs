import { Injectable } from '@nestjs/common';
@Injectable()
export class IsDevService {
  findAll() {
    return `This action returns all isDev`;
  }

  findOne(id: number) {
    return `This action returns a #${id} isDev`;
  }
}
