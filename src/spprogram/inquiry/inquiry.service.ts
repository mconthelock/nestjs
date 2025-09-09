import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import * as oracledb from 'oracledb'; // ต้อง import oracledb เพื่อกำหนดชนิดข้อมูลของ parameter
import { Injectable, NotFoundException } from '@nestjs/common';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryGroup } from '../inquiry-group/entities/inquiry-group.entity';
import { InquiryDetail } from '../inquiry-detail/entities/inquiry-detail.entity';
import { History } from '../history/entities/history.entity';
import { Timeline } from '../timeline/entities/timeline.entity';

import { searchDto } from './dto/search.dto';
import { createInqDto } from './dto/create-inquiry.dto';
import { createDto as dtDto } from '../inquiry-detail/dto/create.dto';

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
    @InjectDataSource('spsysConnection')
    private ds: DataSource,

    @InjectRepository(Inquiry, 'spsysConnection')
    private readonly inq: Repository<Inquiry>,
  ) {}

  async findOne(id: number) {
    return this.inq.findOne({
      where: { INQ_ID: id },
      relations: {
        inqgroup: true,
        details: { logs: true },
        status: true,
        quotype: true,
        method: true,
        term: true,
        shipment: true,
      },
    });
  }

  async findByNumber(no: string) {
    return this.inq.findOne({
      where: { INQ_NO: no, INQ_LATEST: 1 },
      relations: {
        inqgroup: true,
        details: { logs: true },
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
      relations: ['inqgroup', 'status', 'maruser'],
    });
  }

  async create(dto: createInqDto, details: any[]) {
    const runner = this.ds.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      await runner.manager.save(Inquiry, dto);
      const inquiry = await runner.manager.findOne(Inquiry, {
        where: { INQ_NO: dto.INQ_NO, INQ_LATEST: 1 },
      });

      await runner.manager.save(Timeline, {
        INQ_NO: inquiry.INQ_NO,
        INQ_REV: inquiry.INQ_REV,
        MAR_USER: inquiry.INQ_MAR_PIC,
        MAR_SEND: new Date(),
      });

      const items = details.map((el) => {
        const itemVal = Math.floor(el.INQD_ITEM / 100);
        if (itemVal === 5) return 2;
        if (itemVal >= 6) return 6;
        return itemVal;
      });
      const groups: number[] = [...new Set(items)];
      const newGroups = groups.map((groupVal) =>
        runner.manager.create(InquiryGroup, {
          INQ_ID: inquiry.INQ_ID,
          INQG_STATUS: inquiry.INQ_STATUS,
          INQG_REV: '*',
          INQG_GROUP: groupVal,
          INQG_LATEST: 1,
        }),
      );

      await runner.manager.save(InquiryGroup, newGroups);
      const savedGroups = await runner.manager.find(InquiryGroup, {
        where: { INQ_ID: inquiry.INQ_ID },
      });

      const detailPromises = details.map((el, d) => {
        let item = Math.floor(el.INQD_ITEM / 100);
        if (item === 5) item = 2;
        if (item >= 6) item = 6;
        const grp_id_obj = savedGroups.find((val) => val.INQG_GROUP === item);
        const detail = runner.manager.create(InquiryDetail, {
          ...el,
          INQD_RUNNO: d + 1,
          INQID: inquiry.INQ_ID,
          INQG_GROUP: grp_id_obj.INQG_ID,
          INQD_LATEST: 1,
          CREATE_AT: new Date(),
          UPDATE_AT: new Date(),
        });
        return detail;
      });

      const newDetails = await Promise.all(detailPromises);
      await runner.manager.save(InquiryDetail, newDetails);
      const log = runner.manager.create(History, {
        INQ_NO: dto.INQ_NO,
        INQ_REV: dto.INQ_REV,
        INQH_USER: dto.INQ_MAR_PIC,
        INQH_ACTION: dto.INQ_REV == '*' ? 1 : 3,
        INQH_REMARK: dto.INQ_REMARK,
      });
      await runner.manager.save(History, log);
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async update(
    header: createInqDto,
    details: any[],
    deleteLine: any[],
    deleteFile: any[],
  ) {
    const runner = this.ds.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const inquiry = await runner.manager.findOne(Inquiry, {
        where: { INQ_NO: header.INQ_NO, INQ_LATEST: 1 },
      });

      let inqid = inquiry.INQ_ID;
      if (header.INQ_REV != inquiry.INQ_REV) {
        delete inquiry.INQ_ID;
        Object.assign(inquiry, header);
        inqid = await this.dupplicate(runner, inquiry, details, inqid);
      } else {
        const remark = header.INQ_REMARK;
        delete header.INQ_REMARK;
        Object.assign(inquiry, header);
        await runner.manager.update(Inquiry, { INQ_ID: inqid }, inquiry);
        for (const el of details) {
          const dbdetail = await runner.manager.findOne(InquiryDetail, {
            where: { INQD_ID: el.INQD_ID },
          });

          if (dbdetail) {
            const dto: dtDto = Object.assign({} as dtDto, dbdetail);
            Object.assign(dto, el);
            await runner.manager.update(
              InquiryDetail,
              { INQD_ID: el.INQD_ID },
              dto,
            );
          } else {
            let item = Math.floor(el.INQD_ITEM / 100);
            if (item === 5) item = 2;
            if (item >= 6) item = 6;
            //Check ว่ามี Group นี้ แล้วยัง
            const group = await runner.manager.findOne(InquiryGroup, {
              where: {
                INQ_ID: inquiry.INQ_ID,
                INQG_GROUP: item,
                INQG_LATEST: 1,
              },
            });

            let groupid;
            if (!group) {
              await runner.manager.save(InquiryGroup, {
                INQ_ID: inquiry.INQ_ID,
                INQG_STATUS: inquiry.INQ_STATUS,
                INQG_REV: '*',
                INQG_GROUP: item,
                INQG_LATEST: 1,
              });
              const savedGroups = await runner.manager.findOne(InquiryGroup, {
                where: { INQ_ID: inquiry.INQ_ID, INQG_GROUP: item },
              });

              groupid = savedGroups.INQG_ID;
            } else {
              groupid = group.INQG_ID;
            }

            el.CREATE_AT = new Date();
            el.CREATE_BY = header.UPDATE_BY;
            el.UPDATE_AT = new Date();
            el.UPDATE_BY = header.UPDATE_BY;
            el.INQG_GROUP = groupid;
            el.INQID = inquiry.INQ_ID;
            const dto: dtDto = Object.assign({} as dtDto, el);

            console.log(el);
            await runner.manager.save(InquiryDetail, dto);
          }
        }

        if (deleteLine !== undefined) {
          for (const del of deleteLine) {
            await runner.manager.update(
              InquiryDetail,
              { INQD_ID: del },
              { INQD_LATEST: 0 },
            );
          }
          //Remove some group that not avialable in detail
          await this.removeGroups(runner, inqid);
        }
      }
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async dupplicate(runner, data, values, id) {
    const header = data;
    const dbdetail = await runner.manager.find(InquiryDetail, {
      where: { INQID: data.INQ_ID, INQD_LATEST: 1 },
    });
    values.forEach((el) => {
      //console.log(el);
      const val = dbdetail.find((db) => el.INQD_ID == db.INQD_ID);
      if (val !== undefined) Object.assign(val, el);
      el.INQD_PREV = el.INQD_ID;
      el.CREATE_AT = new Date(data.UPDATE_AT);
      el.CREATE_BY = data.UPDATE_BY;
      el.UPDATE_AT = new Date(data.UPDATE_AT);
      el.UPDATE_BY = data.UPDATE_BY;
      delete el.INQD_ID;
      delete el.INQG_GROUP;
      delete el.INQID;
    });
    await this.create(header, values);
    await runner.manager.update(Inquiry, { INQ_ID: id }, { INQ_LATEST: 0 });
    await runner.manager.update(
      InquiryGroup,
      { INQ_ID: id },
      { INQG_LATEST: 0 },
    );
    await runner.manager.update(
      InquiryDetail,
      { INQID: id },
      { INQD_LATEST: 0 },
    );
    return 0;
  }

  async removeGroups(runner, id) {
    const details = await runner.manager.find(InquiryDetail, {
      where: { INQID: id, INQD_LATEST: 1 },
    });
    const groups = [...new Set(details.map((d) => d.INQG_GROUP))];
    await runner.manager
      .createQueryBuilder()
      .update(InquiryGroup)
      .set({ INQG_LATEST: 0 })
      .where('INQ_ID = :id', { id })
      .andWhere('INQG_ID NOT IN (:...groups)', { groups })
      .execute();
  }

  async delete(searchDto: searchDto) {
    const params = [
      searchDto.INQ_ID,
      searchDto.INQ_MAR_PIC,
      searchDto.INQ_MAR_REMARK,
      { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    ];
    const sql = `
      BEGIN
        INQUIRY_DELETE(
            P_ID => :1,
            P_USER => :2,
            P_REMARK=> :3,
            P_RESULT => :4
        );
      END;`;
    const result = await this.ds.query(sql, params);
    if (result[0] == null) {
      throw new NotFoundException(
        `Inquiry with ID (${searchDto.INQ_ID}) not found.`,
      );
    }
    return { status: true, title: result[0] };
  }
}
