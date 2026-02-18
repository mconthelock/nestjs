import { Inject, Injectable } from '@nestjs/common';
import { CreateItemSheetMfgDto } from './dto/create-item-sheet-mfg.dto';
import { UpdateItemSheetMfgDto } from './dto/update-item-sheet-mfg.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ITEM_SHEET_MFG } from 'src/common/Entities/escs/table/ITEM_SHEET_MFG.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { Request } from 'express';

@Injectable()
export class ItemSheetMfgRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateItemSheetMfgDto) {
    return this.getRepository(ITEM_SHEET_MFG).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from ITEM_MFG`);
    // return this.getRepository(ITEM_MFG).find();
    return this.manager.find(ITEM_SHEET_MFG);
  }

  findOne(id: number) {
    return this.getRepository(ITEM_SHEET_MFG).findOneBy({ NID: id });
  }

  findByItemId(itemId: number) {
    return this.getRepository(ITEM_SHEET_MFG).find({
      where: { NITEMID: itemId },
      relations: ['ITEM_LIST', 'ITEM_LIST.HISTORY', 'ITEM'],
      order: { NID: 'ASC' },
    });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(ITEM_SHEET_MFG, 'I');
    this.applyFilters(qb, 'I', dto, [
      'NID',
      'NITEMID',
      'VSHEET_NAME',
      'NSTATUS',
      'NSEC_ID',
    ]);
    return qb
      .leftJoinAndSelect('I.ITEM_LIST', 'ITEM_LIST')
      .leftJoinAndSelect('ITEM_LIST.HISTORY', 'HISTORY')
      .leftJoinAndSelect('I.ITEM', 'ITEM')
      .orderBy('I.NID', 'ASC')
      .getMany();
  }

  async update(id: number, dto: UpdateItemSheetMfgDto) {
    return this.getRepository(ITEM_SHEET_MFG).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(ITEM_SHEET_MFG).delete(id);
  }
}
