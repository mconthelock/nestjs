import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateControlDrawingPisDto } from './dto/create-control-drawing-pis.dto';
import { UpdateControlDrawingPisDto } from './dto/update-control-drawing-pis.dto';
import { CONTROL_DRAWING_PIS } from 'src/common/Entities/escs/table/CONTROL_DRAWING_PIS.entity';

@Injectable({ scope: Scope.REQUEST })
export class ControlDrawingPisRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateControlDrawingPisDto) {
    return this.getRepository(CONTROL_DRAWING_PIS).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from BLOCK_MASTER`);
    // return this.getRepository(ItemMasterAuthorize).find();
    return this.manager.find(CONTROL_DRAWING_PIS);
  }

  findOne(id: number) {
    return this.getRepository(CONTROL_DRAWING_PIS).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(CONTROL_DRAWING_PIS, 'I');
    this.applyFilters(qb, 'I', dto, ['NID', 'NITEMID', 'VDRAWING', 'NSTATUS', 'NUSERUPDATE']);
    return qb
      .orderBy('I.NID', 'ASC')
      .getMany();
  }

  async update(id: number, dto: UpdateControlDrawingPisDto) {
    return this.getRepository(CONTROL_DRAWING_PIS).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(CONTROL_DRAWING_PIS).delete(id);
  }
}
