import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { piline_bending_main } from 'src/common/Entities/workload/table/piline_bending_main.entity';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';

import { CreatePilineBendingMainDto } from './dto/create_piline_bending_main.dto';

@Injectable()
export class PilineBendingMainRepository
  extends BaseRepository
{
  constructor(
    @InjectDataSource('workloadConnection')
    ds: DataSource,
  ) {
    super(ds);
  }

  findAll() {
    return this.manager.find(piline_bending_main, {
      order: {
        RECORD_DATE: 'DESC',
      },
    });
  }

  findOne(idtag: string) {
    return this.getRepository(
      piline_bending_main,
    ).findOneBy({
      IDTAG: idtag,
    });
  }

  create(dto: CreatePilineBendingMainDto) {
    const repository = this.getRepository(
      piline_bending_main,
    );

    const entity = repository.create({
      ...dto,
      IDTAG: dto.IDTAG.trim(),
      RECORD_DATE: dto.RECORD_DATE
        ? new Date(dto.RECORD_DATE)
        : new Date(),
    });

    return repository.save(entity);
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(
      piline_bending_main,
      'B',
    );

    this.applyFilters(qb, 'B', dto, [
      'IDTAG',
      'TYPE',
      'SHEET_COLOR',
      'ITEM',
      'AT',
      'BT',
      'AM',
      'BM',
      'AL',
      'BL',
      'TA1',
      'TA2',
      'TA3',
      'TA4',
      'TB1',
      'TB2',
      'TB3',
      'TB4',
      'RECORD_DATE',
      'RECORD_BY',
    ]);

    return qb
      .orderBy('B.RECORD_DATE', 'DESC')
      .getMany();
  }
}