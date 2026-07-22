import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WTYPE_SECPIC } from 'src/common/Entities/webform/table/WTYPE_SECPIC.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { SECPIC } from 'src/common/Entities/webform/table/SECPIC.entity';

@Injectable()
export class WtypeSecpicRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(WTYPE_SECPIC);
  }

  findOne(tid: number, secid: number) {
    return this.getRepository(WTYPE_SECPIC).findOneBy({
      TID: Number(tid),
      SECID: Number(secid),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(
      WTYPE_SECPIC,
      'WS',
    );

    this.applyFilters(qb, 'WS', dto, [
      'TID',
      'SECID',
    ]);

    return qb.getMany();
  }

  findSectionsByWtype(tid: number) {
    return this.manager
      .createQueryBuilder(WTYPE_SECPIC, 'W')
      .innerJoin(
        SECPIC,
        'S',
        'S.SECID = W.SECID',
      )
      .select('S.SEC', 'SEC')
      .addSelect('S.SECCODE', 'SECCODE')
      .where('W.TID = :tid', {
        tid: Number(tid),
      })
      .orderBy('S.SEC', 'ASC')
      .getRawMany();
  }
}