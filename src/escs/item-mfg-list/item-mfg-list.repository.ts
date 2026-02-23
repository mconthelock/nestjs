import { Inject, Injectable } from '@nestjs/common';
import { CreateItemMfgListDto } from './dto/create-item-mfg-list.dto';
import { UpdateItemMfgListDto } from './dto/update-item-mfg-list.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ITEM_MFG_LIST } from 'src/common/Entities/escs/table/ITEM_MFG_LIST.entity';

@Injectable()
export class ItemMfgListRepository extends BaseRepository {
  constructor(
      @InjectDataSource('escsConnection') ds: DataSource,
      @Inject(REQUEST) req: Request,
    ) {
      super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
  
    async create(dto: CreateItemMfgListDto) {
      return this.getRepository(ITEM_MFG_LIST).save(dto);
    }
  
    findAll() {
      // ใช้ได้ทั้งหมด
      // return this.manager.query(`select * from ITEM_MFG_LIST`);
      // return this.getRepository(ITEM_MFG_LIST).find();
      return this.manager.find(ITEM_MFG_LIST);
    }
  
    findOne(id: number) {
      return this.getRepository(ITEM_MFG_LIST).findOneBy({ NID: id });
    }
  
    async search(dto: FiltersDto) {
      const qb = this.manager.createQueryBuilder(ITEM_MFG_LIST, 'I');
      this.applyFilters(qb, 'I', dto, [
        'NID',
        'NITEMID',
        'VDRAWING',
        'NSHEETID',
        'VNUMBER_FILE',
        'NSTATUS',
        'NUSERUPDATE',
      ]);
      return qb
        .leftJoinAndSelect('I.HISTORY', 'H')
        .orderBy('I.NITEMID, I.NSHEETID, I.VDRAWING', 'ASC')
        .getMany();
    }
  
    async update(id: number, dto: UpdateItemMfgListDto) {
      return this.getRepository(ITEM_MFG_LIST).update(id, dto);
    }

    async updateBySheetId(sheetId: number, dto: UpdateItemMfgListDto) {
      return this.getRepository(ITEM_MFG_LIST).update({ NSHEETID: sheetId }, dto);
    }
  
    async remove(id: number) {
      return this.getRepository(ITEM_MFG_LIST).delete(id);
    }
}
