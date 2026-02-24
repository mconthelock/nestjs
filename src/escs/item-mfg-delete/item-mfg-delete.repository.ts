import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateItemMfgDeleteDto } from './dto/create-item-mfg-delete.dto';
import { UpdateItemMfgDeleteDto } from './dto/update-item-mfg-delete.dto';
import { ITEM_MFG_DELETE } from 'src/common/Entities/escs/table/ITEM_MFG_DELETE.entity';

@Injectable({ scope: Scope.REQUEST })
export class ItemMfgDeleteRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateItemMfgDeleteDto) {
    return this.getRepository(ITEM_MFG_DELETE).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from BLOCK_MASTER`);
    // return this.getRepository(ItemMasterAuthorize).find();
    return this.manager.find(ITEM_MFG_DELETE);
  }

  findOne(id: number) {
    return this.getRepository(ITEM_MFG_DELETE).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(ITEM_MFG_DELETE, 'I');
    this.applyFilters(qb, 'I', dto, ['NID', 'NITEMID', 'VDRAWING', 'NSTATUS', 'NUSERUPDATE']);
    return qb
      .orderBy('I.NID', 'ASC')
      .getMany();
  }

  async update(id: number, dto: UpdateItemMfgDeleteDto) {
    return this.getRepository(ITEM_MFG_DELETE).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(ITEM_MFG_DELETE).delete(id);
  }
}
