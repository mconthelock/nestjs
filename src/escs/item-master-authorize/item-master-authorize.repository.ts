import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateItemMasterAuthorizeDto } from './dto/create-item-master-authorize.dto';
import { UpdateItemMasterAuthorizeDto } from './dto/update-item-master-authorize.dto';
import { ITEM_MASTER_AUTHORIZE } from 'src/common/Entities/escs/table/ITEM_MASTER_AUTHORIZE.entity';

@Injectable({ scope: Scope.REQUEST })
export class ItemMasterAuthorizeRepository extends BaseRepository {
  constructor(
    @InjectDataSource('escsConnection') ds: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  async create(dto: CreateItemMasterAuthorizeDto) {
    return this.getRepository(ITEM_MASTER_AUTHORIZE).save(dto);
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from BLOCK_MASTER`);
    // return this.getRepository(ItemMasterAuthorize).find();
    return this.manager.find(ITEM_MASTER_AUTHORIZE);
  }

  findOne(id: number) {
    return this.getRepository(ITEM_MASTER_AUTHORIZE).findOneBy({ NID: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(ITEM_MASTER_AUTHORIZE, 'I');
    this.applyFilters(qb, 'I', dto, ['VAUTH', 'NTYPE', 'NSTATUS']);
    return qb
      .leftJoinAndSelect('I.TYPE_DETAIL', 'TYPE_DETAIL')
      .orderBy('I.NID', 'ASC')
      .getMany();
  }

  async update(id: number, dto: UpdateItemMasterAuthorizeDto) {
    return this.getRepository(ITEM_MASTER_AUTHORIZE).update(id, dto);
  }

  async remove(id: number) {
    return this.getRepository(ITEM_MASTER_AUTHORIZE).delete(id);
  }
}
