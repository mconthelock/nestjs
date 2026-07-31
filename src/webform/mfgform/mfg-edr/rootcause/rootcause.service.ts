import { Injectable } from '@nestjs/common';

import { RootcauseRepository } from './rootcause.repository';

@Injectable()
export class RootcauseService {
  constructor(
    private readonly rootcauseRepository: RootcauseRepository,
  ) {}

  findAll() {
    return this.rootcauseRepository.findAll();
  }

  findByFiscalYear(fyear: number) {
    return this.rootcauseRepository.findByFiscalYear(fyear);
  }
}