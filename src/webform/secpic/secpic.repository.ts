import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { SECPIC } from 'src/webform/secpic/entities/secpic.entity';

@Injectable()
export class SecpicRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(SECPIC);
  }

  findOne(secid: number) {
    return this.getRepository(SECPIC).findOneBy({
      SECID: Number(secid),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(SECPIC, 'S');

    this.applyFilters(qb, 'S', dto, [
      'SECID',
      'SECCODE',
      'SEC',
      'REJECTNO',
    ]);

    return qb.getMany();
  }
}