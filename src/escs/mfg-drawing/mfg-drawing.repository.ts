import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateMfgDrawingDto } from './dto/create-mfg-drawing.dto';
import { UpdateMfgDrawingDto } from './dto/update-mfg-drawing.dto';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';

@Injectable()
export class MfgDrawingRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateMfgDrawingDto) {
    return this.getRepository(MFG_DRAWING).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from MFG_DRAWING`);
    // return this.getRepository(MFG_DRAWING).find();
    return this.manager.find(MFG_DRAWING);
  }

  findOne(id: number) {
    return this.getRepository(MFG_DRAWING).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(MFG_DRAWING, 'M');
    this.applyFilters(qb, 'M', dto, [
      'NID',
      'NBLOCKID',
      'NITEMID',
      'VPIS',
      'VDRAWING',
      'NINSPECTOR_STATUS',
      'NFORELEAD_STATUS'
    ]);
    return qb.orderBy('M.NID, M.NBLOCKID, M.NITEMID, M.VPIS, M.VDRAWING', 'ASC').getMany();
  }

  async update(id: number, dto: UpdateMfgDrawingDto) {
    return this.getRepository(MFG_DRAWING).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(MFG_DRAWING).delete(id);
  }
}
