import { Injectable } from '@nestjs/common';

import { SearchRootcauseDto } from './dto/search-rootcause.dto';
import { RootcauseRepository } from './rootcause.repository';

@Injectable()
export class RootcauseService {
  constructor(
    private readonly rootcauseRepository: RootcauseRepository,
  ) {}

  search(dto: SearchRootcauseDto) {
    return this.rootcauseRepository.search(dto);
  }
}