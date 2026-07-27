import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

import { piline_bending_att } from 'src/common/Entities/workload/table/PILINE_BENDING_ATT.entity';

@Injectable()
export class PilineBendingAttRepository extends BaseRepository {
  constructor(
    @InjectDataSource('workloadConnection')
    ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(piline_bending_att);
  }

  findOne(idtag: string) {
    return this.getRepository(
      piline_bending_att,
    ).findBy({
      IDTAG: idtag,
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(
      piline_bending_att,
      'A',
    );

    this.applyFilters(qb, 'A', dto, [
      'IDTAG',
      'ID',
      'FILE_NAME',
    ]);

    return qb.getMany();
  }
}