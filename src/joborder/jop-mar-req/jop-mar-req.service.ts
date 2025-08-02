import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { CreateJopMarReqDto } from './dto/create-jop-mar-req.dto';
import { UpdateJopMarReqDto } from './dto/update-jop-mar-req.dto';

import { JopMarReq } from './entities/jop-mar-req.entity';
import { numberToAlphabetRevision } from 'src/utils/format';

import { AmeccalendarService } from 'src/amecmfg/ameccalendar/ameccalendar.service';

@Injectable()
export class JopMarReqService {
  constructor(
    @InjectRepository(JopMarReq, 'amecConnection')
    private reqRepo: Repository<JopMarReq>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,

    private readonly amecCalendarService: AmeccalendarService,
  ) {}

  async create(dto: CreateJopMarReqDto) {
    const { MFGNO, PONO, LINENO, ...updateData } = dto;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const latest = await this.findLatestRevision(MFGNO, PONO, LINENO);
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // เตรียมข้อมูล
      const dataToSave: Partial<JopMarReq> = {
        JOP_MFGNO: MFGNO,
        JOP_PONO: PONO,
        JOP_LINENO: LINENO,
        JOP_MAR_REQUEST: updateData.ACTION_BY,
        JOP_MAR_REQUEST_DATE: updateData.REQUESTDATE
          ? new Date(updateData.REQUESTDATE + ' 00:00:00')
          : null,
        JOP_MAR_REMARK: updateData.REMARK || null,
        JOP_MAR_INPUT_DATE: new Date(), // ใช้เวลาปัจจุบันเป็นวันที่ป้อนข้อมูล
      };
      let result = null;
      if (latest) {
        latest.JOP_REVISION += 1; // เพิ่ม Revision ขึ้น 1
        Object.assign(latest, dataToSave);
        result = await queryRunner.manager.save(latest); // ไม่ต้องแปลงเพราะ select โดย typeorm จะคืนค่า entity object อยู่แล้ว
      } else {
        dataToSave.JOP_REVISION = 1; // กำหนด Revision เป็น 1 ถ้าเป็น Record ใหม่
        const newRecord = queryRunner.manager.create(JopMarReq, dataToSave); // ต้องแปลง plain object เป็น entity object ก่อนบันทึกเสมอ
        result = await queryRunner.manager.save(newRecord);
      }
      result.DeadLinePUR = await this.amecCalendarService.addWorkDays(
        result.JOP_MAR_INPUT_DATE,
        7,
      );
      const revision = await this.getRevisionHistory(
        MFGNO,
        PONO,
        LINENO,
        queryRunner,
      ); // ค้นหา Revision History ทั้งหมดหลังจากบันทึกใหม่
      await queryRunner.commitTransaction();
      return {
        message: 'Request date set successfully',
        data: result,
        status: true,
        rev: revision.map((r) => {
          r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
          return {
            REVISION: r.JOP_REVISION,
            REVISION_TEXT: r.JOP_REVISION_TEXT,
            ACTION_BY: r.JOP_MAR_REQUEST,
            DATE: r.JOP_MAR_REQUEST_DATE,
            REMARK: r.JOP_MAR_REMARK,
            INPUT_DATE: r.JOP_MAR_INPUT_DATE,
            NAME: r.marRequest.SNAME,
          };
        }), // ส่ง Revision History กลับไป
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findLatestRevision(
    mfgno: string,
    pono: number,
    lineno: number,
  ): Promise<JopMarReq | null> {
    return await this.dataSource.getRepository(JopMarReq).findOne({
      where: {
        JOP_MFGNO: mfgno,
        JOP_PONO: pono,
        JOP_LINENO: lineno,
      },
      order: {
        JOP_REVISION: 'DESC',
      },
    });
  }

  async getRevisionHistory(
    mfgno: string,
    pono: number,
    lineno: number,
    queryRunner?: QueryRunner,
  ): Promise<JopMarReq[]> {
    let repo: Repository<JopMarReq>;
    if (queryRunner) {
      repo = queryRunner.manager.getRepository(JopMarReq);
    } else {
      repo = this.reqRepo;
      //   repo = this.dataSource.getRepository(JopMarReq);
    }
    return await repo
      .createQueryBuilder('jop')
      .where('jop.JOP_MFGNO = :mfgno', { mfgno })
      .andWhere('jop.JOP_PONO = :pono', { pono })
      .andWhere('jop.JOP_LINENO = :lineno', { lineno })
      .andWhere(
        'jop.JOP_REVISION < (SELECT MAX(r2.JOP_REVISION) FROM JOP_MAR_REQ r2 WHERE r2.JOP_MFGNO = :mfgno2 AND r2.JOP_PONO = :pono2 AND r2.JOP_LINENO = :lineno2)',
        { mfgno2: mfgno, pono2: pono, lineno2: lineno },
      )
      .orderBy('jop.JOP_REVISION', 'ASC')
      .leftJoinAndSelect('jop.marRequest', 'marRequest')
      //   .leftJoinAndSelect('jop.purConfirm', 'purConfirm')
      .select([
        'jop.JOP_REVISION',
        'jop.JOP_MAR_REQUEST',
        'jop.JOP_MAR_REQUEST_DATE',
        'jop.JOP_MAR_INPUT_DATE',
        'jop.JOP_MAR_REMARK',
        // 'jop.JOP_PUR_CONFIRM',
        // 'jop.JOP_PUR_CONFIRM_DATE',
        // 'jop.JOP_PUR_INPUT_DATE',
        // 'jop.JOP_PUR_REMARK',
        'marRequest.SEMPNO',
        'marRequest.SNAME',
        // 'purConfirm.SEMPNO',
        // 'purConfirm.SNAME',
      ])
      .getMany();
  }
}
