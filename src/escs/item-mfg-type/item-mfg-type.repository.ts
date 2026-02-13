import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateItemMfgTypeDto } from './dto/create-item-mfg-type.dto';
import { UpdateItemMfgTypeDto } from './dto/update-item-mfg-type.dto';
import { ITEM_MFG_TYPE } from 'src/common/Entities/escs/table/ITEM_MFG_TYPE.entity';

@Injectable({ scope: Scope.REQUEST })
export class ItemMfgTypeRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateItemMfgTypeDto) {
    return this.getRepository(ITEM_MFG_TYPE).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from ITEM_MFG_TYPE`);
    // return this.getRepository(ITEM_MFG_TYPE).find();
    return this.manager.find(ITEM_MFG_TYPE);
  }

  findOne(id: number) {
    return this.getRepository(ITEM_MFG_TYPE).findOneBy({ NTYPE: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(ITEM_MFG_TYPE, 'I');
    this.applyFilters(qb, 'I', dto, [
      'NTYPE',
    ]);
    return qb.orderBy('I.NTYPE', 'ASC').getMany();
  }

  async update(id: number, dto: UpdateItemMfgTypeDto) {
    return this.getRepository(ITEM_MFG_TYPE).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(ITEM_MFG_TYPE).delete(id);
  }
}
