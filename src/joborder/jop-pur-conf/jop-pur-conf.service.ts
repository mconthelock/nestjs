import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { CreateJopPurConfDto } from './dto/create-jop-pur-conf.dto';
import { UpdateJopPurConfDto } from './dto/update-jop-pur-conf.dto';

import { JopPurConf } from './entities/jop-pur-conf.entity';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';

import { AmeccalendarService } from 'src/amecmfg/ameccalendar/ameccalendar.service';
import { JopMarReqService } from '../jop-mar-req/jop-mar-req.service';

import { UpdateJopMarReqDto } from '../jop-mar-req/dto/update-jop-mar-req.dto';
import { SearchJopPurConfDto } from './dto/search-jop-pur-conf.dto';
import { getSafeFields } from 'src/utils/Fields';

@Injectable()
export class JopPurConfService {
  constructor(
    @InjectRepository(JopPurConf, 'amecConnection')
    private confRepo: Repository<JopPurConf>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,

    private readonly amecCalendarService: AmeccalendarService,
    private readonly jopMarReqService: JopMarReqService,
  ) {}

  private readonly JOP_PUR_CONF = this.dataSource
    .getMetadata('JOP_PUR_CONF')
    .columns.map((c) => c.propertyName);
  private readonly AMECUSERALL = this.dataSource
    .getMetadata('AMECUSERALL')
    .columns.map((c) => c.propertyName);
  private readonly allowFields = [...this.JOP_PUR_CONF, ...this.AMECUSERALL];

  async create(dto: CreateJopPurConfDto) {
    const { MFGNO, PONO, LINENO, ...updateData } = dto;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const latest = await this.findLatestRevision(MFGNO, PONO, LINENO);
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // เตรียมข้อมูล
      const dataToSave: Partial<JopPurConf> = {
        JOP_MFGNO: MFGNO,
        JOP_PONO: PONO,
        JOP_LINENO: LINENO,
        JOP_PUR_CONFIRM: updateData.ACTION_BY,
        JOP_PUR_CONFIRM_DATE: updateData.CONFIRMDATE
          ? new Date(updateData.CONFIRMDATE + ' 00:00:00')
          : null,
        JOP_PUR_REMARK: updateData.REMARK || null,
        JOP_PUR_INPUT_DATE: new Date(), // ใช้เวลาปัจจุบันเป็นวันที่ป้อนข้อมูล
      };
      let result = null;
      if (latest) {
        latest.JOP_REVISION += 1; // เพิ่ม Revision ขึ้น 1
        Object.assign(latest, dataToSave);
        result = await queryRunner.manager.save(latest); // ไม่ต้องแปลงเพราะ select โดย typeorm จะคืนค่า entity object อยู่แล้ว
      } else {
        dataToSave.JOP_REVISION = 1; // กำหนด Revision เป็น 1 ถ้าเป็น Record ใหม่
        const newRecord = queryRunner.manager.create(JopPurConf, dataToSave); // ต้องแปลง plain object เป็น entity object ก่อนบันทึกเสมอ
        result = await queryRunner.manager.save(newRecord);
      }
      const revision = await this.getRevisionHistory(
        MFGNO,
        PONO,
        LINENO,
        queryRunner,
      ); // ค้นหา Revision History ทั้งหมดหลังจากบันทึกใหม่
      const updatePurStatus = await this.jopMarReqService.update(
        {
          MFGNO,
          PONO,
          LINENO,
          JOP_PUR_STATUS: 1,
        } as UpdateJopMarReqDto,
        queryRunner,
      );
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
            ACTION_BY: r.JOP_PUR_CONFIRM,
            DATE: r.JOP_PUR_CONFIRM_DATE,
            REMARK: r.JOP_PUR_REMARK,
            INPUT_DATE: r.JOP_PUR_INPUT_DATE,
            NAME: r.purConfirm.SNAME,
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
  ): Promise<JopPurConf | null> {
    return await this.dataSource.getRepository(JopPurConf).findOne({
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
  ): Promise<JopPurConf[]> {
    let repo: Repository<JopPurConf>;
    if (queryRunner) {
      repo = queryRunner.manager.getRepository(JopPurConf);
    } else {
      repo = this.confRepo;
      //   repo = this.dataSource.getRepository(JopMarReq);
    }
    return await repo
      .createQueryBuilder('jop')
      .where('jop.JOP_MFGNO = :mfgno', { mfgno })
      .andWhere('jop.JOP_PONO = :pono', { pono })
      .andWhere('jop.JOP_LINENO = :lineno', { lineno })
      .andWhere(
        'jop.JOP_REVISION < (SELECT MAX(r2.JOP_REVISION) FROM JOP_PUR_CONF r2 WHERE r2.JOP_MFGNO = :mfgno2 AND r2.JOP_PONO = :pono2 AND r2.JOP_LINENO = :lineno2)',
        { mfgno2: mfgno, pono2: pono, lineno2: lineno },
      )
      .orderBy('jop.JOP_REVISION', 'ASC')
      //   .leftJoinAndSelect('jop.marRequest', 'marRequest')
      .leftJoinAndSelect('jop.purConfirm', 'purConfirm')
      .select([
        'jop.JOP_REVISION',
        // 'jop.JOP_MAR_REQUEST',
        // 'jop.JOP_MAR_REQUEST_DATE',
        // 'jop.JOP_MAR_INPUT_DATE',
        // 'jop.JOP_MAR_REMARK',
        'jop.JOP_PUR_CONFIRM',
        'jop.JOP_PUR_CONFIRM_DATE',
        'jop.JOP_PUR_INPUT_DATE',
        'jop.JOP_PUR_REMARK',
        // 'marRequest.SEMPNO',
        // 'marRequest.SNAME',
        'purConfirm.SEMPNO',
        'purConfirm.SNAME',
      ])
      .getMany();
  }

  async search(dto: SearchJopPurConfDto, queryRunner?: QueryRunner) {
    const fields = dto.fields || [];
    const repo = queryRunner ? queryRunner.manager : this.dataSource;
    const query = repo
      .createQueryBuilder()
      .from('JOP_PUR_CONF', 'A')
      .innerJoin(
        (qb) =>
          qb
            .subQuery()
            .select(
              'JOP_MFGNO, JOP_PONO, JOP_LINENO, MAX(JOP_REVISION) AS LAST_REVISION',
            )
            .from('JOP_PUR_CONF', 'MAR')
            .groupBy('JOP_MFGNO, JOP_PONO, JOP_LINENO'),
        'B',
        'A.JOP_MFGNO = B.JOP_MFGNO AND A.JOP_PONO = B.JOP_PONO AND A.JOP_LINENO = B.JOP_LINENO AND B.LAST_REVISION = A.JOP_REVISION',
      )
      .innerJoin('AMECUSERALL', 'U', 'A.JOP_PUR_CONFIRM = U.SEMPNO');
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
    if (dto.JOP_PUR_CONFIRM)
      query.andWhere('A.JOP_PUR_CONFIRM = :purConfirm', {
        purConfirm: dto.JOP_PUR_CONFIRM,
      });
    if (dto.JOP_PUR_CONFIRM_DATE) {
      query.andWhere(
        `TRUNC(A.JOP_PUR_CONFIRM_DATE) = TO_DATE(:JOP_PUR_CONFIRM_DATE, 'YYYY-MM-DD')`,
        { JOP_PUR_CONFIRM_DATE: dto.JOP_PUR_CONFIRM_DATE },
      );
    }
    if (dto.JOP_PUR_INPUT_DATE) {
      query.andWhere(
        `TRUNC(A.JOP_PUR_INPUT_DATE) = TO_DATE(:JOP_PUR_INPUT_DATE, 'YYYY-MM-DD')`,
        { JOP_PUR_INPUT_DATE: dto.JOP_PUR_INPUT_DATE },
      );
    }
    if (dto.SCONFDATE) {
      query.andWhere(
        `A.JOP_PUR_INPUT_DATE >= TO_DATE(:SCONFDATE, 'YYYY-MM-DD')`,
        { SCONFDATE: dto.SCONFDATE },
      );
    }
    if (dto.ECONFDATE) {
      query.andWhere(
        `A.JOP_PUR_INPUT_DATE <= TO_DATE(:ECONFDATE, 'YYYY-MM-DD')`,
        { ECONFDATE: dto.ECONFDATE },
      );
    }
    if (dto.SINPUTDATE) {
      query.andWhere(
        `A.JOP_PUR_INPUT_DATE >= TO_DATE(:SINPUTDATE, 'YYYY-MM-DD')`,
        { SINPUTDATE: dto.SINPUTDATE },
      );
    }
    if (dto.EINPUTDATE) {
      query.andWhere(
        `A.JOP_PUR_INPUT_DATE <= TO_DATE(:EINPUTDATE, 'YYYY-MM-DD')`,
        { EINPUTDATE: dto.EINPUTDATE },
      );
    }
    return await query.getRawMany();
  }
}
