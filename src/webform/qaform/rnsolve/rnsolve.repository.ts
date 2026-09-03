import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { RNSOLVE } from 'src/common/Entities/webform/table/RNSOLVE.entity';

@Injectable()
export class RnsolveRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(RNSOLVE);
  }

  findOne(
    nfrmno: number,
    vorgno: string,
    cyear: string,
    cyear2: string,
    nrunno: number,
    id: number,
  ) {
    return this.getRepository(RNSOLVE).findOneBy({
      NFRMNO: Number(nfrmno),
      VORGNO: vorgno,
      CYEAR: cyear,
      CYEAR2: cyear2,
      NRUNNO: Number(nrunno),
      ID: Number(id),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(RNSOLVE, 'R');

    this.applyFilters(qb, 'R', dto, [
      'NFRMNO',
      'VORGNO',
      'CYEAR',
      'CYEAR2',
      'NRUNNO',
      'ID',
      'CMID',
      'CSID',
      'METHOD',
      'DUEDATE',
      'PERSON',
      'CHECKER',
    ]);

    return qb.getMany();
  }
}