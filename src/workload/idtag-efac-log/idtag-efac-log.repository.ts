import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateIdtagEfacLogDto } from './dto/create-idtag-efac-log.dto';
import { UpdateIdtagEfacLogDto } from './dto/update-idtag-efac-log.dto';
import { IDTAG_EFAC_LOG } from 'src/common/Entities/workload/table/IDTAG_EFAC_LOG.entity';

@Injectable()
export class IdtagEfacLogRepository extends BaseRepository {
  constructor(
    @InjectDataSource('workloadConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateIdtagEfacLogDto) {
    return this.getRepository(IDTAG_EFAC_LOG).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from IDTAG_EFAC_LOG`);
    // return this.getRepository(IDTAG_EFAC_LOG).find();
    return this.manager.find(IDTAG_EFAC_LOG);
  }

  findOne(id: number) {
    return this.getRepository(IDTAG_EFAC_LOG).findOneBy({ ID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(IDTAG_EFAC_LOG, 'I');
    this.applyFilters(qb, 'I', dto, [
      'ID',
      'CONTROL_NO',
      'PROCESS_NAME',
      'MONTH',
      'YEAR',
      'RUNNO',
      'PRINT_DATETIME',
      'LOT_NO',
      'PRINT_BY'
    ]);
    return qb.orderBy('I.MONTH, I.YEAR, I.RUNNO, I.CONTROL_NO, I.LOT_NO', 'ASC').getMany();
  }

  async update(id: number, dto: UpdateIdtagEfacLogDto) {
    return this.getRepository(IDTAG_EFAC_LOG).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(IDTAG_EFAC_LOG).delete(id);
  }
}
