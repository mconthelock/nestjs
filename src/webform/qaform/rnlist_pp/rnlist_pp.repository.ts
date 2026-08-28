import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { RNLIST_PP } from 'src/common/Entities/webform/table/RNLIST_PP.entity';
import { CreateRnlistDto } from '../rnlist/dto/create-rnlist.dto';

@Injectable()
export class RnlistPpRepository extends BaseRepository {
  constructor(
    @InjectDataSource('webformConnection') ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(RNLIST_PP);
  }

  findOne(
    nfrmno: number,
    vorgno: string,
    cyear: string,
    cyear2: string,
    nrunno: number,
    id: number,
  ) {
    return this.getRepository(RNLIST_PP).findOneBy({
      NFRMNO: Number(nfrmno),
      VORGNO: vorgno,
      CYEAR: cyear,
      CYEAR2: cyear2,
      NRUNNO: Number(nrunno),
      ID: Number(id),
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(RNLIST_PP, 'R');

    this.applyFilters(qb, 'R', dto, [
      'NFRMNO',
      'VORGNO',
      'CYEAR',
      'CYEAR2',
      'NRUNNO',
      'ID',
      'ORDERNO',
      'DWGNO',
      'PROJNO',
      'PROD',
      'ITEM',
      'PART',
      'MODEL',
      'QTY',
      'LOSS',
      'GENORDNO',
      'ORIGINORD',
      'GENDATE',
      'REFNO',
    ]);

    return qb.getMany();
  }

    create(dto: CreateRnlistDto) {
      return this.manager.save(RNLIST_PP, dto);
    }

    createMany(dto: CreateRnlistDto[]) {
      return this.manager.save(RNLIST_PP, dto);
    }
  
}