import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { RNWASTE } from 'src/common/Entities/webform/table/RNWASTE.entity';

@Injectable()
export class RnwasteRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(RNWASTE);
  }

  findOne(wid: number) {
    return this.getRepository(RNWASTE).findOneBy({
      WID: Number(wid),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(RNWASTE, 'R');

    this.applyFilters(qb, 'R', dto, [
      'WID',
      'WASTE',
    ]);

    return qb.getMany();
  }
}