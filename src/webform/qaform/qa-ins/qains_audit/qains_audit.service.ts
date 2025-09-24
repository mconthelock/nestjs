import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateQainsAuditDto,
  saveQainsAuditDto,
} from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { QainsAudit } from './entities/qains_audit.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { FormService } from 'src/webform/form/form.service';
import { QaFileService } from '../../qa_file/qa_file.service';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { throwError } from 'rxjs';

@Injectable()
export class QainsAuditService {
  constructor(
    @InjectRepository(QainsAudit, 'amecConnection')
    private auditRepo: Repository<QainsAudit>,
    @InjectDataSource('amecConnection')
    private readonly dataSource: DataSource,
    private readonly qainsOAService: QainsOAService,
    private readonly formService: FormService,
    private readonly qafileService: QaFileService,
  ) {}

  async saveAudit(
    dto: saveQainsAuditDto,
    files: Express.Multer.File[],
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      };

      // delete old records
      await this.delete(
        {
          ...form,
          QAA_TYPECODE: dto.typecode,
          QAA_AUDIT_SEQ: dto.auditSeq,
        },
        queryRunner,
      );
      // insert new records
      for (const d of dto.data) {
        await this.create(d, queryRunner);
      }

      // update QainsOA
      //   if (!dto.draft) {
      await this.qainsOAService.update(
        {
          ...form,
          QOA_TYPECODE: dto.typecode,
          QOA_SEQ: dto.auditSeq,
          QOA_AUDIT: dto.draft ? 2 : 1,
          QOA_RESULT: dto.res,
          QOA_PERCENT: dto.percent,
          QOA_GRADE: dto.grade,
          QOA_AUDIT_RESULT: dto.auditResult,
          QOA_IMPROVMENT_ACTIVITY: dto.auditActivity,
        },
        queryRunner,
      );
      //   }

      // delete old files
      if (dto.delImageIds) {
        for (const id of dto.delImageIds) {
          const file = await this.qafileService.getQaFileByID({
            ...form,
            FILE_TYPECODE: 'ESI',
            FILE_ID: id,
          });
          const path = await joinPaths(file.FILE_PATH, file.FILE_FNAME);
          await deleteFile(path);
          await this.qafileService.delete({
            ...form,
            FILE_TYPECODE: 'ESI',
            FILE_ID: id,
          });
        }
      }

      // move files
      const formNo = await this.formService.getFormno(form); // Get the form number
      movedTargets = await this.qafileService.moveAndInsertFiles({
        files,
        form,
        path,
        folder: await joinPaths(formNo, dto.auditSeq.toString()),
        typecode: 'ESI',
        requestedBy: dto.actionBy,
        ext1: dto.auditSeq,
        ext2: dto.typecode,
        queryRunner,
      });
      console.log('files', files);

      console.log('movedTargets', movedTargets);

      await queryRunner.commitTransaction();
      return { status: true, message: 'Save audit successfully' };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      await Promise.allSettled([
        ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
        ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
      ]);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(dto: CreateQainsAuditDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    let didConnect = false;
    let didStartTx = false;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        didConnect = true;
        await localRunner.startTransaction();
        didStartTx = true;
      }
      const runner = queryRunner || localRunner!;

      await runner.manager.insert(QainsAudit, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert audit Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert audit ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async delete(dto: UpdateQainsAuditDto, queryRunner?: QueryRunner) {
    console.log(dto);

    let localRunner: QueryRunner | undefined;
    let didConnect = false;
    let didStartTx = false;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        didConnect = true;
        await localRunner.startTransaction();
        didStartTx = true;
      }
      const runner = queryRunner || localRunner!;

      await runner.manager.delete(QainsAudit, {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        QAA_TYPECODE: dto.QAA_TYPECODE,
        QAA_AUDIT_SEQ: dto.QAA_AUDIT_SEQ,
        // QAA_TOPIC: dto.QAA_TOPIC,
        // QAA_SEQ: dto.QAA_SEQ,
      });
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return { status: true, message: 'Delete master Successfully' };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete master Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
