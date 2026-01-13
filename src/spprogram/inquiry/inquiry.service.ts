import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, Raw } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import * as dayjs from 'dayjs';
// ต้อง import oracledb เพื่อกำหนดชนิดข้อมูลของ parameter
// import * as oracledb from 'oracledb';

//Entities
import { Inquiry } from './entities/inquiry.entity';
import { InquiryGroup } from '../inquiry-group/entities/inquiry-group.entity';
import { InquiryDetail } from '../inquiry-detail/entities/inquiry-detail.entity';
import { History } from '../history/entities/history.entity';
import { Timeline } from '../timeline/entities/timeline.entity';
import { Attachments } from '../attachments/entities/attachments.entity';
import { Shipment } from '../shipment/entities/shipment.entity';

import { Orderpart } from 'src/marketing/orderparts/entities/orderpart.entity';
import { Spcalsheet } from 'src/marketing/spcalsheet/entities/spcalsheet.entity';

//DTOs
import { searchDto } from './dto/search.dto';
import { createInqDto } from './dto/create-inquiry.dto';
import { updateInqDto } from './dto/update-inquiry.dto';
import { createDetailDto } from '../inquiry-detail/dto/create.dto';
import { createTimelineDto } from '../timeline/dto/create-dto';
import { updateTimelineDto } from '../timeline/dto/update-dto';
import { createHistoryDto } from '../history/dto/create.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectDataSource('spsysConnection')
    private ds: DataSource,

    @InjectRepository(Inquiry, 'spsysConnection')
    private readonly inq: Repository<Inquiry>,
  ) {}

  async search(searchDto: searchDto) {
    const qb = this.inq
      .createQueryBuilder('inq')
      .leftJoinAndSelect('inq.inqgroup', 'inqgroup')
      .leftJoinAndSelect('inq.status', 'status')
      .leftJoinAndSelect('inq.maruser', 'maruser');

    if (searchDto.IS_DETAILS) {
      qb.leftJoinAndSelect(
        'inq.details',
        'details',
        'details.INQD_LATEST = :latest',
        { latest: 1 },
      );
      delete searchDto.IS_DETAILS;

      if (searchDto.IS_ORDERS) {
        // prettier-ignore
        qb.leftJoinAndMapMany('inq.sheet', Spcalsheet,'sheet', 'inq.INQ_NO = sheet.INQNO AND details.INQD_SEQ = sheet.LINENO')
            .leftJoinAndMapMany('inq.orders', Orderpart, 'orders', 'inq.INQ_NO = orders.INQUIRY_NO AND orders.REVISION_CODE != :rev', { rev: 'D' })
            .leftJoinAndSelect('inq.shipment', 'shipment');
        delete searchDto.IS_ORDERS;
      }
    }
    if (searchDto.IS_ORDERS) delete searchDto.IS_ORDERS;

    if (searchDto.IS_TIMELINE) {
      qb.leftJoinAndSelect('inq.timeline', 'timeline');
      delete searchDto.IS_TIMELINE;
    }

    if (searchDto.IS_QUOTATION) {
      qb.leftJoinAndSelect('inq.quotation', 'quotation');
      delete searchDto.IS_QUOTATION;
    }

    qb.where('inq.INQ_LATEST = :latest', { latest: 1 });
    await applyDynamicFilters(qb, searchDto, 'inq');
    return qb.getMany();
  }

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
        timeline: true,
        shipment: true,
        quotation: true,
        weight: true,
        maruser: true,
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
        maruser: true,
        timeline: true,
      },
    });
  }

  async setCondition(qb, searchDto) {
    for (const key in searchDto) {
      let operator = '';
      let alias = '';
      const parts = key.split('_');
      const subParts = parts[0].split('.');
      if (subParts.length > 1) {
        alias = subParts[0];
        operator = subParts[1];
      } else {
        operator = parts[0];
        alias = 'inq';
      }

      switch (operator) {
        case 'LIKE':
          const like = key.replace(`${parts[0]}_`, '').trim();
          qb.andWhere(`TRIM(${alias}.${like}) LIKE :${like}_like`, {
            [`${like}_like`]: `%${searchDto[key].trim()}%`,
          });
          break;
        case 'ISNULL':
          const isnull = key.replace(`${parts[0]}_`, '').trim();
          qb.andWhere(`${alias}.${isnull} IS NULL`);
          break;
        case 'LE':
          const le = key.replace(`${parts[0]}_`, '').trim();
          qb.andWhere(`${alias}.${le} <= :${le}_le`, {
            [`${le}_le`]: searchDto[key],
          });
          break;
        case 'GE':
          const ge = key.replace(`${parts[0]}_`, '').trim();
          qb.andWhere(`${alias}.${ge} >= :${ge}_ge`, {
            [`${ge}_ge`]: searchDto[key],
          });
          break;
        default:
          if (subParts.length > 1) {
            qb.andWhere(`${key} = :${key}`, { [key]: searchDto[key] });
          } else {
            qb.andWhere(`${alias}.${key} = :${key}`, { [key]: searchDto[key] });
          }
          break;
      }
    }
  }

  async create(
    dto: createInqDto,
    details: any[],
    timelinedata?: createTimelineDto,
    history?: createHistoryDto,
  ) {
    const runner = this.ds.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const inquiry = await runner.manager.save(Inquiry, dto);
      await runner.manager.save(Timeline, timelinedata);
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
          INQG_REV: '*',
          INQG_STATUS: 0,
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
          INQG_GROUP: grp_id_obj.INQG_ID,
          INQD_RUNNO: d + 1,
          INQD_LATEST: 1,
          INQID: inquiry.INQ_ID,
          CREATE_AT: new Date(),
          UPDATE_AT: new Date(),
        });
        return detail;
      });
      const newDetails = await Promise.all(detailPromises);
      await runner.manager.save(InquiryDetail, newDetails);
      await runner.manager.insert(History, history);
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async update(
    header: updateInqDto,
    details: any[],
    deleteLine: any[],
    deleteFile: any[],
    timelinedata?: updateTimelineDto,
    history?: createHistoryDto,
  ) {
    const runner = this.ds.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let inquiry = await runner.manager.findOne(Inquiry, {
        where: { INQ_NO: header.INQ_NO, INQ_LATEST: 1 },
      });
      let revised = false;
      if (header.INQ_REV != inquiry.INQ_REV) {
        inquiry = await this.revise(inquiry.INQ_ID, runner);
        revised = true;
      }

      //Update inquiry
      //const remark = header.INQ_REMARK;
      delete header.INQ_REMARK;
      delete header.INQ_ID;
      Object.assign(inquiry, header);
      await runner.manager.update(
        Inquiry,
        { INQ_ID: inquiry.INQ_ID, INQ_LATEST: 1 },
        inquiry,
      );

      //Delete line
      if (deleteLine !== undefined) {
        for (const del of deleteLine) {
          const del_id = revised
            ? { INQD_PREV: del, INQD_LATEST: 1 }
            : { INQD_ID: del, INQD_LATEST: 1 };
          await runner.manager.update(InquiryDetail, del_id, {
            INQD_LATEST: 0,
          });
        }
      }

      //Update inquiry detail
      for (const dt of details) {
        const dt_id = revised
          ? { INQD_PREV: dt.INQD_ID, INQD_LATEST: 1 }
          : { INQD_ID: dt.INQD_ID, INQD_LATEST: 1 };
        const db_detail = await runner.manager.findOne(InquiryDetail, {
          where: dt_id,
        });

        //Check group
        let group_id;
        let item = Math.floor(parseInt(dt.INQD_ITEM) / 100);
        if (item === 5) item = 2;
        if (item >= 6) item = 6;
        const group = await runner.manager.findOne(InquiryGroup, {
          where: {
            INQ_ID: inquiry.INQ_ID,
            INQG_GROUP: item,
            INQG_LATEST: 1,
          },
        });

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
          group_id = savedGroups.INQG_ID;
        } else {
          group_id = group.INQG_ID;
        }

        dt.UPDATE_AT = new Date();
        dt.UPDATE_BY = header.UPDATE_BY;
        dt.INQG_GROUP = group_id;
        dt.INQID = inquiry.INQ_ID;
        if (db_detail) {
          const dto: createDetailDto = Object.assign(
            {} as createDetailDto,
            db_detail,
          );
          Object.assign(dto, dt);
          delete dto.INQD_ID;
          delete dto.INQID;
          delete dto.INQD_PREV;
          await runner.manager.update(InquiryDetail, dt_id, dto);
        } else {
          //Create new detail
          dt.CREATE_AT = new Date();
          dt.CREATE_BY = header.UPDATE_BY;
          const dto: createDetailDto = Object.assign({} as createDetailDto, dt);
          await runner.manager.save(InquiryDetail, dto);
        }
      }

      //Delete attachfile
      if (deleteFile !== undefined) {
        for (const file of deleteFile) {
          await runner.manager.update(
            Attachments,
            { FILE_ID: file },
            {
              FILE_STATUS: 0,
            },
          );
        }
      }

      //Delete unused group
      const final_group = await runner.manager.find(InquiryGroup, {
        where: { INQ_ID: inquiry.INQ_ID, INQG_LATEST: 1 },
        relations: ['details'],
      });
      for (const final of final_group) {
        if (!final.details || final.details.length === 0) {
          await runner.manager.update(
            InquiryGroup,
            { INQG_ID: final.INQG_ID },
            { INQG_LATEST: 0 },
          );
        }
      }

      if (timelinedata !== undefined) {
        const timeline = await runner.manager.findOne(Timeline, {
          where: { INQ_NO: inquiry.INQ_NO, INQ_REV: inquiry.INQ_REV },
        });
        if (timeline !== undefined) {
          Object.assign(timeline, timelinedata);
          await runner.manager.update(
            Timeline,
            { INQ_NO: inquiry.INQ_NO, INQ_REV: inquiry.INQ_REV },
            timeline,
          );
          console.log('Update Timeline');
          console.log({ INQ_NO: inquiry.INQ_NO, INQ_REV: inquiry.INQ_REV });
          console.log(timeline);
        }
      }
      runner.manager.insert(History, history);
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async revise(id, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.ds.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      //Inquiry
      const inquiry = await runner.manager.findOne(Inquiry, {
        where: { INQ_ID: id },
      });
      delete inquiry.INQ_ID;
      const rev = await this.revision_code(inquiry.INQ_REV);
      Object.assign(inquiry, { INQ_REV: rev });
      const newinq = await runner.manager.save(Inquiry, inquiry);
      await runner.manager.update(Inquiry, { INQ_ID: id }, { INQ_LATEST: 0 }); //Update INQ_LATEST
      console.log('Inserted Inquiry');

      //Inquiry Group
      const inquiry_group = await runner.manager.find(InquiryGroup, {
        where: { INQ_ID: id },
      });
      for (const group of inquiry_group) {
        delete group.INQG_ID;
        Object.assign(group, { INQG_REV: rev, INQ_ID: newinq.INQ_ID });
      }
      await runner.manager.save(InquiryGroup, inquiry_group);
      console.log('Inserted Inquiry Group');
      await runner.manager.update(
        InquiryGroup,
        { INQ_ID: id },
        { INQG_LATEST: 0 },
      ); //Update INQG_LATEST

      //Inquiry Detail
      const inquiry_detail = await runner.manager.find(InquiryDetail, {
        where: { INQID: id },
      });
      for (const detail of inquiry_detail) {
        Object.assign(detail, {
          INQID: newinq.INQ_ID,
          INQD_PREV: detail.INQD_ID,
        });
        delete detail.INQD_ID;
      }
      await runner.manager.save(InquiryDetail, inquiry_detail);
      console.log('Inserted Inquiry Detail');
      await runner.manager.update(
        InquiryDetail,
        { INQID: id },
        { INQD_LATEST: 0 },
      ); //Update INQD_LATEST

      //Inquiry Timeline
      const timeline = await runner.manager.create(Timeline, {
        INQ_NO: newinq.INQ_NO,
        INQ_REV: newinq.INQ_REV,
        MAR_USER: newinq.INQ_MAR_PIC,
      });
      await runner.manager.save(Timeline, timeline);
      console.log('Inserted Inquiry Timeline');
      if (localRunner) await localRunner.commitTransaction();
      return newinq;
    } catch (error) {
      console.error('Error update flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw new Error('Update flow Error: ' + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }

    // return newinq;
    // const runner = this.ds.createQueryRunner();
    // const header = data;
    // const dbdetail = await runner.manager.find(InquiryDetail, {
    //   where: { INQID: data.INQ_ID, INQD_LATEST: 1 },
    // });
    // values.forEach((el) => {
    //   //console.log(el);
    //   const val = dbdetail.find((db) => el.INQD_ID == db.INQD_ID);
    //   if (val !== undefined) Object.assign(val, el);
    //   el.INQD_PREV = el.INQD_ID;
    //   el.CREATE_AT = new Date(data.UPDATE_AT);
    //   el.CREATE_BY = data.UPDATE_BY;
    //   el.UPDATE_AT = new Date(data.UPDATE_AT);
    //   el.UPDATE_BY = data.UPDATE_BY;
    //   delete el.INQD_ID;
    //   delete el.INQG_GROUP;
    //   delete el.INQID;
    // });
    // await this.create(header, values);
    // await runner.manager.update(Inquiry, { INQ_ID: id }, { INQ_LATEST: 0 });
    // await runner.manager.update(
    //   InquiryGroup,
    //   { INQ_ID: id },
    //   { INQG_LATEST: 0 },
    // );
    // await runner.manager.update(
    //   InquiryDetail,
    //   { INQID: id },
    //   { INQD_LATEST: 0 },
    // );
    // return 0;
  }

  async revision_code(current) {
    if (current === '*') return 'A';
    const recursive = (val) => {
      if (/^[A-Z]$/.test(val)) {
        if (val === 'Z') {
          return 'A';
        }
        return String.fromCharCode(val.charCodeAt(0) + 1);
      }
      return val;
    };
    let chars = current.split('');
    let nb = chars.length - 1;
    for (var i = nb; i >= 0; i--) {
      chars[i] = recursive(chars[i]);
      if (chars[i] != 'A') break;
    }
    return chars.join('');
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

  //   async delete(searchDto: searchDto) {
  //     const params = [
  //       searchDto.INQ_ID,
  //       searchDto.INQ_MAR_PIC,
  //       searchDto.INQ_MAR_REMARK,
  //       { dir: oracledb.BIND_OUT, type: oracledb.STRING },
  //     ];
  //     const sql = `
  //       BEGIN
  //         INQUIRY_DELETE(
  //             P_ID => :1,
  //             P_USER => :2,
  //             P_REMARK=> :3,
  //             P_RESULT => :4
  //         );
  //       END;`;
  //     const result = await this.ds.query(sql, params);
  //     if (result[0] == null) {
  //       throw new NotFoundException(
  //         `Inquiry with ID (${searchDto.INQ_ID}) not found.`,
  //       );
  //     }
  //     return { status: true, title: result[0] };
  //   }

  async updatestatus(id: number, status: number, history?: createHistoryDto) {
    const runner = this.ds.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let inquiry = await runner.manager.findOne(Inquiry, {
        where: { INQ_ID: id },
      });
      await runner.manager.update(
        Inquiry,
        { INQ_ID: id },
        { INQ_STATUS: status },
      );
      if (history) {
        await runner.manager.insert(History, history);
      }
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async designProcess() {
    const query = `SELECT * FROM DESIGN_PROCESS`;
    const result = await this.ds.query(query);
    return result;
  }

  async searchSP(req: any) {
    const query = this.ds
      .createQueryBuilder()
      .select(
        "INQ_NO, INQ_TRADER, INQ_TYPE, METHOD_DESC, IDS_DATE, CREATEBY, TRADER, SERIES, PRJ_NO, PRJ_NAME, MFGNO, ORDER_NO, PO_MELTEC, CAR_NO, AGENT, DSTN, AMEC_SCHDL, CUST_RQS, CASE WHEN INQ_TRADER = 'Direct' THEN 'STOCK PART' ELSE INQ_TRADER||'/' END AS SHIP, PT, MARREQPRDN, REMARK, P_O_AMOUNT, CSQTY, PCATE_NAME, C.*",
      )
      .from('SP_INQUIRY', 'A')
      .innerJoin('SP_METHOD', 'B', 'A.INQ_DELIVERY_METHOD = B.METHOD_ID')
      .innerJoin(
        'SP_INQUIRY_DETAIL',
        'C',
        'A.INQ_ID = C.INQID AND INQD_LATEST = 1',
      )
      .leftJoin(
        'TMARKET_TEMP_PARTS',
        'D',
        "A.INQ_NO = D.INQUIRY_NO AND REVISION_CODE != 'D'",
      )
      .leftJoin(
        'SPCALSHEET_DETAIL_QTY',
        'E',
        'E.ORDNO = D.ORDER_NO AND E.ELVNO = D.ELV_NO AND E.INQNO = A.INQ_NO  AND E.CSSEQ = C.INQD_SEQ',
      )
      .innerJoin('MS_PARTS_CATEGORY', 'F', 'D.PART_CATEGORY = F.PCATE_CODE')
      .where('INQ_LATEST = 1');

    if (req) {
      const date_list = ['SINQ_DATE', 'EINQ_DATE', 'SIDS_DATE', 'EIDS_DATE'];
      const like_list = ['MFGNO', 'CAR_NO'];
      for (const key in req) {
        if (date_list.includes(key)) {
          const dateKey = key.substring(1); // Remove first char (S or E)
          query.andWhere(
            `${dateKey} ${key.startsWith('S') ? '>=' : '<='} to_date(:${key}, 'YYYYMMDD')`,
            {
              [key]: dayjs(req[key]).format('YYYYMMDD'),
            },
          );
          continue;
        }

        if (like_list.includes(key)) {
          const trimmedValue = req[key].trim();
          query.andWhere(`${key} LIKE :${key}`, {
            [key]: `%${trimmedValue}%`,
          });
          continue;
        }

        if (key == 'IS_ORDERS') {
          query.andWhere('E.INQNO IS NOT NULL');
          continue;
        }

        const trimmedValue = req[key].trim();
        query.andWhere(`${key} = :${key}`, { [key]: trimmedValue });
      }
    }
    return await query.getRawMany();
  }
}
