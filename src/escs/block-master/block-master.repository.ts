import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreateBlockMasterDto } from './dto/create-block-master.dto';
import { BLOCK_MASTER } from 'src/common/Entities/escs/table/BLOCK_MASTER.entity';
import { UpdateBlockMasterDto } from './dto/update-block-master.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable({ scope: Scope.REQUEST })
export class BlockMasterRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateBlockMasterDto) {
    return this.getRepository(BLOCK_MASTER).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from BLOCK_MASTER`);
    // return this.getRepository(BlockMaster).find();
    return this.manager.find(BLOCK_MASTER);
  }

  findOne(id: number) {
    return this.getRepository(BLOCK_MASTER).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(BLOCK_MASTER, 'B');
    this.applyFilters(qb, 'B', dto, [
      'NID',
      'VNAME',
      'VCODE',
      'NSTATUS',
      'NUSERUPDATE',
    ]);
    return qb.orderBy('B.NID', 'ASC').getMany();
  }

  async update(id: number, dto: UpdateBlockMasterDto) {
    return this.getRepository(BLOCK_MASTER).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(BLOCK_MASTER).delete(id);
  }
}
