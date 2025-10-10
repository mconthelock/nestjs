import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SetRequestDate } from './entities/set-request-date.entity';
import { UpsertSetRequestDateDto } from './dto/create-set-request-date.dto';
import { UpdateSetRequestDateDto } from './dto/update-set-request-date.dto';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';

// กำหนด Interface สำหรับผลลัพธ์ที่คืนกลับไป
interface Result {
  record: SetRequestDate;
  status: 201 | 200;
  revision?: SetRequestDate[]; // ถ้าต้องการคืน Revision History ด้วย
}

@Injectable()
export class SetRequestDateService {
  constructor(
    @InjectRepository(SetRequestDate, 'amecConnection')
    private setRequestDateRepository: Repository<SetRequestDate>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  async setRequestDate(upsertDto: UpsertSetRequestDateDto): Promise<Result> {
    const { MFGNO, PONO, LINENO, ...updateData } = upsertDto;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const latest = await this.findLatestRevision(MFGNO, PONO, LINENO);
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // เตรียมข้อมูล
      const dataToSave: Partial<SetRequestDate> = {
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
        const newRecord = queryRunner.manager.create(
          SetRequestDate,
          dataToSave,
        ); // ต้องแปลง plain object เป็น entity object ก่อนบันทึกเสมอ
        result = await queryRunner.manager.save(newRecord);
      }
      await queryRunner.commitTransaction();
      const revision = await this.getRevisionHistory(MFGNO, PONO, LINENO); // ค้นหา Revision History ทั้งหมดหลังจากบันทึกใหม่
      return {
        record: result,
        status: 200,
        revision: revision.map((r) => {
          r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
          return r;
        }),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(
        err.message || 'Error occurred while saving data',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // เมธอดสำหรับค้นหา Revision ล่าสุดตาม MFGNO, PONO, LINENO
  async findLatestRevision(
    mfgno: string,
    pono: number,
    lineno: number,
  ): Promise<SetRequestDate | null> {
    return await this.dataSource.getRepository(SetRequestDate).findOne({
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
  ): Promise<SetRequestDate[]> {
    const repo = this.dataSource.getRepository(SetRequestDate);
    return await repo
      .createQueryBuilder('jop')
      .where('jop.JOP_MFGNO = :mfgno', { mfgno })
      .andWhere('jop.JOP_PONO = :pono', { pono })
      .andWhere('jop.JOP_LINENO = :lineno', { lineno })
      .andWhere(
        'jop.JOP_REVISION < (SELECT MAX(r2.JOP_REVISION) FROM JOP_REQ r2 WHERE r2.JOP_MFGNO = :mfgno2 AND r2.JOP_PONO = :pono2 AND r2.JOP_LINENO = :lineno2)',
        { mfgno2: mfgno, pono2: pono, lineno2: lineno },
      )
      .orderBy('jop.JOP_REVISION', 'ASC')
      .leftJoinAndSelect('jop.marRequest', 'marRequest')
      .leftJoinAndSelect('jop.purConfirm', 'purConfirm')
      .select([
        'jop.JOP_REVISION',
        'jop.JOP_MAR_REQUEST',
        'jop.JOP_MAR_REQUEST_DATE',
        'jop.JOP_MAR_INPUT_DATE',
        'jop.JOP_MAR_REMARK',
        'jop.JOP_PUR_CONFIRM',
        'jop.JOP_PUR_CONFIRM_DATE',
        'jop.JOP_PUR_INPUT_DATE',
        'jop.JOP_PUR_REMARK',
        'marRequest.SEMPNO',
        'marRequest.SNAME',
        'purConfirm.SEMPNO',
        'purConfirm.SNAME',
      ])
      .getMany();
  }

  async UpdateJop(dto: UpdateSetRequestDateDto): Promise<{
    record: SetRequestDate[];
    status: 200;
  }> {
    const {
      REVISION,
      PONO,
      LINENO,
      MFGNO,
      ACTION_BY,
      REMARK,
      PUR_REMARK,
      CONFIRMDATE,
      ...data
    } = dto;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      let latest: any[] = [];
      if (!REVISION && !MFGNO) {
        latest = await this.setRequestDateRepository
          .createQueryBuilder('A')
          .select(
            'MAX(A.JOP_REVISION) AS JOP_REVISION, A.JOP_MFGNO, A.JOP_PONO, A.JOP_LINENO',
          )
          .where('A.JOP_PONO = :pono AND A.JOP_LINENO = :lineno', {
            pono: PONO,
            lineno: LINENO,
          })
          .groupBy('A.JOP_MFGNO, A.JOP_PONO, A.JOP_LINENO')
          .getRawMany();
      } else if (REVISION && !MFGNO) {
        latest = await this.setRequestDateRepository
          .createQueryBuilder('A')
          .select('A.JOP_REVISION, A.JOP_MFGNO, A.JOP_PONO, A.JOP_LINENO')
          .where(
            'A.JOP_PONO = :pono AND A.JOP_LINENO = :lineno AND A.JOP_REVISION = :revision',
            {
              pono: PONO,
              lineno: LINENO,
              revision: REVISION,
            },
          )
          .getRawMany();
      } else if (!REVISION && MFGNO) {
        latest = await this.setRequestDateRepository
          .createQueryBuilder('A')
          .select(
            'MAX(A.JOP_REVISION) AS JOP_REVISION, A.JOP_MFGNO, A.JOP_PONO, A.JOP_LINENO',
          )
          .where('A.JOP_MFGNO = :mfgno AND A.JOP_PONO = :pono AND A.JOP_LINENO = :lineno', {
            mfgno: MFGNO,
            pono: PONO,
            lineno: LINENO,
          })
          .groupBy('A.JOP_MFGNO, A.JOP_PONO, A.JOP_LINENO')
          .getRawMany();
      } else {
        latest = [
          {
            JOP_REVISION: REVISION,
            JOP_MFGNO: MFGNO,
            JOP_PONO: PONO,
            JOP_LINENO: LINENO,
          },
        ];
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const data = latest.map((row) =>
        this.setRequestDateRepository.create({
          JOP_MFGNO: row.JOP_MFGNO,
          JOP_PONO: row.JOP_PONO,
          JOP_LINENO: row.JOP_LINENO,
          JOP_REVISION: row.JOP_REVISION,
          JOP_PUR_STATUS: 1,
          JOP_PUR_CONFIRM: ACTION_BY,
          JOP_PUR_CONFIRM_DATE: CONFIRMDATE
            ? new Date(CONFIRMDATE + ' 00:00:00')
            : null,
          JOP_PUR_REMARK: PUR_REMARK || null,
          JOP_PUR_INPUT_DATE: new Date(), // ใช้เวลาปัจจุบันเป็นวันที่ป้อนข้อมูล
        }),
      );

      const result = await queryRunner.manager.save(SetRequestDate, data);

      await queryRunner.commitTransaction();
      return { record: result, status: 200 };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(
        error.message ||
        'Error occurred while saving data',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
