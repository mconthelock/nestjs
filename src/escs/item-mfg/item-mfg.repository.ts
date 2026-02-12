import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { CreateItemMfgDto } from './dto/create-item-mfg.dto';
import { UpdateItemMfgDto } from './dto/update-item-mfg.dto';

@Injectable({ scope: Scope.REQUEST })
export class ItemMfgRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateItemMfgDto) {
    return this.getRepository(ITEM_MFG).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from ITEM_MFG`);
    // return this.getRepository(ITEM_MFG).find();
    return this.manager.find(ITEM_MFG);
  }

  findOne(id: number) {
    return this.getRepository(ITEM_MFG).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(ITEM_MFG, 'I');
    this.applyFilters(qb, 'I', dto, [
      'NID',
      'VITEM_NAME',
      'NBLOCKID',
      'NSTATUS',
      'NSEC_ID',
      'NTYPE',
      'NUSERUPDATE',
    ]);
    return qb.orderBy('I.NID', 'ASC').getMany();
  }

  async update(id: number, dto: UpdateItemMfgDto) {
    return this.getRepository(ITEM_MFG).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(ITEM_MFG).delete(id);
  }
}
