import { Inject, Injectable } from '@nestjs/common';
import { CreateItemMfgHistoryDto } from './dto/create-item-mfg-history.dto';
import { UpdateItemMfgHistoryDto } from './dto/update-item-mfg-history.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ITEM_MFG_HISTORY } from 'src/common/Entities/escs/table/ITEM_MFG_HISTORY.entity';

@Injectable()
export class ItemMfgHistoryRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateItemMfgHistoryDto) {
    return this.getRepository(ITEM_MFG_HISTORY).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from ITEM_MFG_HISTORY`);
    // return this.getRepository(ITEM_MFG_HISTORY).find();
    return this.manager.find(ITEM_MFG_HISTORY);
  }

  findOne(id: number) {
    return this.getRepository(ITEM_MFG_HISTORY).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(ITEM_MFG_HISTORY, 'I');
    this.applyFilters(qb, 'I', dto, [
      'NITEMLISTID',
      'NMARKNUM',
      'VMARK',
      'VINCHARGE',
      'NSTATUS',
      'NUSERUPDATE',
    ]);
    return qb.orderBy('I.NITEMLISTID, I.NMARKNUM', 'ASC').getMany();
  }

  async update(id: number, dto: UpdateItemMfgHistoryDto) {
    return this.getRepository(ITEM_MFG_HISTORY).update(id, dto);
  }

  async updateByItemListId(itemListId: number, dto: UpdateItemMfgHistoryDto) {
    return this.getRepository(ITEM_MFG_HISTORY).update({ NITEMLISTID: itemListId, NSTATUS: Not(3)}, dto);
  }

  async remove(id: number) {
    return this.getRepository(ITEM_MFG_HISTORY).delete(id);
  }
}
