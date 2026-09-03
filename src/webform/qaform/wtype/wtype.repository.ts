import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WTYPE } from 'src/common/Entities/webform/table/WTYPE.entity';

@Injectable()
export class WtypeRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(WTYPE);
  }

  findOne(tid: number) {
    return this.getRepository(WTYPE).findOneBy({
      TID: Number(tid),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(WTYPE, 'W');

    this.applyFilters(qb, 'W', dto, [
      'TID',
      'TYPENAME',
    ]);

    return qb.getMany();
  }
}