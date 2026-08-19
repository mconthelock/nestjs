import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { RNFRM_PART } from 'src/common/Entities/webform/table/RNFRM_PART.entity';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';

@Injectable()
export class RnfrmPartRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(RNFRM_PART);
  }

  findOne(cyear2: string, nrunno: number) {
    return this.getRepository(RNFRM_PART).findOneBy({
      CYEAR2: cyear2,
      NRUNNO: Number(nrunno),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(RNFRM_PART, 'R');

    this.applyFilters(qb, 'R', dto, [
      'CYEAR2',
      'NRUNNO',
      'STATUS',
      'SENDDATE',
      'URGENT',
    ]);

    return qb.getMany();
  }
}