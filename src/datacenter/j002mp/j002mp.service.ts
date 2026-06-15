import { Injectable } from '@nestjs/common';
import { J002mpRepository } from './j002mp.repository';
import { getData } from './dto/searchJ002.dto';

@Injectable()
export class J002mpService {
  constructor(private readonly repo: J002mpRepository){}

  searchData( dto: getData){
      return this.repo.searchData(dto);
    }
}
