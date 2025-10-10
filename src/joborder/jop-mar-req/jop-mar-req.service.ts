import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { CreateJopMarReqDto } from './dto/create-jop-mar-req.dto';
import { UpdateJopMarReqDto } from './dto/update-jop-mar-req.dto';
import { SearchJopMarReqDto } from './dto/search-jop-mar-req.dto';

import { JopMarReq } from './entities/jop-mar-req.entity';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';

import { AmeccalendarService } from 'src/amecmfg/ameccalendar/ameccalendar.service';
import { getSafeFields } from 'src/common/utils/Fields.utils';

@Injectable()
export class JopMarReqService {
  constructor(
    @InjectRepository(JopMarReq, 'amecConnection')
    private reqRepo: Repository<JopMarReq>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,

    private readonly amecCalendarService: AmeccalendarService,
  ) {}

  private readonly JOP_MAR_REQ = this.dataSource
    .getMetadata('JOP_MAR_REQ')
    .columns.map((c) => c.propertyName);
  private readonly AMECUSERALL = this.dataSource
    .getMetadata('AMECUSERALL')
    .columns.map((c) => c.propertyName);
  private readonly allowFields = [...this.JOP_MAR_REQ, ...this.AMECUSERALL];

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
    queryRunner?: QueryRunner,
  ): Promise<JopMarReq | null> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(JopMarReq)
      : this.reqRepo;
    return await repo.findOne({
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
      .select([
        'jop.JOP_REVISION',
        'jop.JOP_MAR_REQUEST',
        'jop.JOP_MAR_REQUEST_DATE',
        'jop.JOP_MAR_INPUT_DATE',
        'jop.JOP_MAR_REMARK',
        'marRequest.SEMPNO',
        'marRequest.SNAME',
      ])
      .getMany();
  }

  async update(dto: UpdateJopMarReqDto, queryRunner?: QueryRunner) {
    const { MFGNO, PONO, LINENO, ...updateData } = dto;
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const record = await this.findLatestRevision(MFGNO, PONO, LINENO, runner);
      if (!record) {
        throw new Error('Record not found');
      }
      Object.assign(record, updateData);
      const result = await runner.manager.save(record);
      if (localRunner) await localRunner.commitTransaction();
      return {
        message: 'Update successful',
        data: result,
        status: true,
      };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async search(dto: SearchJopMarReqDto, queryRunner?: QueryRunner) {
    const fields = dto.fields || [];
    const repo = queryRunner ? queryRunner.manager : this.dataSource;
    const query = repo
      .createQueryBuilder()
      .from('JOP_MAR_REQ', 'A')
      .innerJoin(
        (qb) =>
          qb
            .subQuery()
            .select(
              'JOP_MFGNO, JOP_PONO, JOP_LINENO, MAX(JOP_REVISION) AS LAST_REVISION',
            )
            .from('JOP_MAR_REQ', 'MAR')
            .groupBy('JOP_MFGNO, JOP_PONO, JOP_LINENO'),
        'B',
        'A.JOP_MFGNO = B.JOP_MFGNO AND A.JOP_PONO = B.JOP_PONO AND A.JOP_LINENO = B.JOP_LINENO AND B.LAST_REVISION = A.JOP_REVISION',
      )
      .innerJoin('AMECUSERALL', 'U', 'A.JOP_MAR_REQUEST = U.SEMPNO');
    query.distinct(dto.distinct == true); // เพื่อไม่ให้มีข้อมูลซ้ำ
    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.allowFields);
    } else {
      select = this.allowFields;
    }
    select.forEach((f) => {
      if (this.AMECUSERALL.includes(f)) {
        query.addSelect(`U.${f}`, f);
      } else {
        query.addSelect(`A.${f}`, f);
      }
    });

    if (dto.orderby) query.orderBy(dto.orderby, dto.orderbyDirection);

    if (dto.JOP_REVISION)
      query.andWhere('A.JOP_REVISION = :revision', {
        revision: dto.JOP_REVISION,
      });
    if (dto.JOP_MFGNO)
      query.andWhere('A.JOP_MFGNO = :mfgno', { mfgno: dto.JOP_MFGNO });
    if (dto.JOP_PONO)
      query.andWhere('A.JOP_PONO = :pono', { pono: dto.JOP_PONO });
    if (dto.JOP_LINENO)
      query.andWhere('A.JOP_LINENO = :lineno', { lineno: dto.JOP_LINENO });
    if (dto.JOP_PUR_STATUS)
      query.andWhere('A.JOP_PUR_STATUS = :purStatus', {
        purStatus: dto.JOP_PUR_STATUS,
      });
    if (dto.JOP_MAR_REQUEST)
      query.andWhere('A.JOP_MAR_REQUEST = :marRequest', {
        marRequest: dto.JOP_MAR_REQUEST,
      });
    if (dto.JOP_MAR_REQUEST_DATE) {
      query.andWhere(
        `TRUNC(A.JOP_MAR_REQUEST_DATE) = TO_DATE(:JOP_MAR_REQUEST_DATE, 'YYYY-MM-DD')`,
        { JOP_MAR_REQUEST_DATE: dto.JOP_MAR_REQUEST_DATE },
      );
    }
    if (dto.JOP_MAR_INPUT_DATE) {
      query.andWhere(
        `TRUNC(A.JOP_MAR_INPUT_DATE) = TO_DATE(:JOP_MAR_INPUT_DATE, 'YYYY-MM-DD')`,
        { JOP_MAR_INPUT_DATE: dto.JOP_MAR_INPUT_DATE },
      );
    }
    if (dto.SREQDATE) {
      query.andWhere(
        `A.JOP_MAR_INPUT_DATE >= TO_DATE(:SREQDATE, 'YYYY-MM-DD')`,
        { SREQDATE: dto.SREQDATE },
      );
    }
    if (dto.EREQDATE) {
      query.andWhere(
        `A.JOP_MAR_INPUT_DATE <= TO_DATE(:EREQDATE, 'YYYY-MM-DD')`,
        { EREQDATE: dto.EREQDATE },
      );
    }
    if (dto.SINPUTDATE) {
      query.andWhere(
        `A.JOP_MAR_INPUT_DATE >= TO_DATE(:SINPUTDATE, 'YYYY-MM-DD')`,
        { SINPUTDATE: dto.SINPUTDATE },
      );
    }
    if (dto.EINPUTDATE) {
      query.andWhere(
        `A.JOP_MAR_INPUT_DATE <= TO_DATE(:EINPUTDATE, 'YYYY-MM-DD')`,
        { EINPUTDATE: dto.EINPUTDATE },
      );
    }
    return await query.getRawMany();
  }
}
