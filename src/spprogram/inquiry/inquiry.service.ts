import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryGroupService } from '../inquiry-group/inquiry-group.service';
import { InquiryDetailService } from '../inquiry-detail/inquiry-detail.service';
import { HistoryService } from '../history/history.service';

import { searchDto } from './dto/search.dto';
import { createDto } from './dto/create-inquiry.dto';

interface group {
  INQ_ID: number;
  INQG_GROUP: number;
  INQG_REV: string;
  INQG_STATUS: number;
  INQG_LATEST: number;
}

interface logs {
  INQ_NO: string;
  INQ_REV: string;
  INQH_USER: string;
  INQH_ACTION: number;
  INQH_REMARK: string;
}

@Injectable()
export class InquiryService {
  constructor(
    @InjectDataSource('amecConnection')
    private ds: DataSource,

    @InjectRepository(Inquiry, 'amecConnection')
    private readonly inq: Repository<Inquiry>,
    private inqgrp: InquiryGroupService,
    private inqdt: InquiryDetailService,
    private history: HistoryService,
  ) {}

  async findOne(id: number) {
    return this.inq.findOne({
      where: { INQ_ID: id },
      relations: {
        inqgroup: true,
        details: true,
        status: true,
        quotype: true,
        method: true,
        term: true,
        shipment: true,
      },
    });
  }

  async search(searchDto: searchDto) {
    const q = { INQ_LATEST: 1 };
    return this.inq.find({
      where: {
        ...searchDto,
        ...q,
      },
      order: { INQ_ID: 'DESC' },
      relations: ['inqgroup', 'status'],
    });
  }

  async create(createDto: createDto, details: any[]) {
    const runner = this.ds.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const inq = await this.inq.create(createDto);
      const inqdb = await this.inq.save(inq);
      const inqdata = await this.inq.findOne({
        where: { INQ_NO: inq.INQ_NO, INQ_LATEST: 1 },
      });

      const items = details.map((el) => Math.floor(el.INQD_ITEM / 100));
      const groups: number[] = [...new Set(items)];
      for (let i = 0; i < groups.length; i++) {
        const group: group = {
          INQ_ID: inqdata.INQ_ID,
          INQG_STATUS: inqdata.INQ_STATUS,
          INQG_REV: '*',
          INQG_GROUP: groups[i],
          INQG_LATEST: 1,
        };
        await this.inqgrp.create(group);
      }
      const groupsid = await this.inqgrp.find(inqdata.INQ_ID);
      details.forEach(async (el, d) => {
        const item = Math.floor(el.INQD_ITEM / 100);
        const grp_id = groupsid.find((val) => val.INQG_GROUP == item);
        const data = {
          ...el,
          INQID: inqdata.INQ_ID,
          INQG_GROUP: grp_id.INQG_ID,
          INQD_LATEST: 1,
          INQD_RUNNO: d + 1,
        };
        await this.inqdt.create(data);
      });
      const log: logs = {
        INQ_NO: createDto.INQ_NO,
        INQ_REV: createDto.INQ_REV,
        INQH_USER: createDto.INQ_MAR_PIC,
        INQH_ACTION: 1,
        INQH_REMARK: null,
      };
      await this.history.create(log);
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }
}
