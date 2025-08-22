import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import { moveFileFromMulter, deleteFile } from 'src/common/utils/files.utils';
import { QainsForm } from '../qains_form/entities/qains_form.entity';
import { FormService } from 'src/webform/form/form.service';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { QaFileService } from '../../qa_file/qa_file.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { SearchQainsFormDto } from './dto/search-qains_form.dto';
import { QainsFormDto } from './dto/qains_form.dto';

@Injectable()
export class QainsFormService {
  constructor(
    @InjectRepository(QainsForm, 'amecConnection')
    private readonly qaformRepo: Repository<QainsForm>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,

    private readonly formService: FormService,
    private readonly flowService: FlowService,
    private readonly QainsOAService: QainsOAService,
    private readonly QaFileService: QaFileService,
  ) {}

  async createQainsForm(
    dto: CreateQainsFormDto,
    files: Express.Multer.File[],
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const createForm = await this.formService.create(
        {
          NFRMNO: dto.NFRMNO,
          VORGNO: dto.VORGNO,
          CYEAR: dto.CYEAR,
          REQBY: dto.REQUESTER,
          INPUTBY: dto.CREATEBY,
          REMARK: dto.REMARK,
        },
        ip,
        queryRunner,
      );

      if (!createForm.status) {
        throw new Error(createForm.message);
      }

      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: createForm.data.CYEAR2,
        NRUNNO: createForm.data.NRUNNO,
      };

      // update flow incharge1
      const condIncharge1 = {
        condition: {
          ...form,
          CEXTDATA: '01',
        },
        VAPVNO: dto.QA_INCHARGE_EMPNO,
        VREPNO: dto.QA_INCHARGE_EMPNO,
      };
      this.flowService.updateFlow(condIncharge1, queryRunner);

      // update flow incharge2
      const condIncharge2 = {
        condition: {
          ...form,
          CEXTDATA: '02',
        },
        VAPVNO: dto.QA_INCHARGE_EMPNO,
        VREPNO: dto.QA_INCHARGE_EMPNO,
      };
      this.flowService.updateFlow(condIncharge2, queryRunner);

      // update flow req foreman
      const condForeman = {
        condition: {
          ...form,
          CEXTDATA: '05',
        },
        VAPVNO: dto.REQUESTER,
        VREPNO: dto.REQUESTER,
      };
      this.flowService.updateFlow(condForeman, queryRunner);

      await queryRunner.manager.save(QainsForm, {
        ...form,
        QA_ITEM: dto.QA_ITEM,
        QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
        QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
      });

      for (const e of dto.OPERATOR) {
        await this.QainsOAService.createQainsOA(
          { ...form, QOA_TYPECODE: 'ESO', QOA_EMPNO: e },
          queryRunner,
        );
      }

      const formNo = await this.formService.getFormno(form); // Get the form number
      const destination = path + '/' + formNo; // Get the destination path
      for (const file of files) {
        console.log('file: ', file);
        const moved = await moveFileFromMulter(file, destination);
        movedTargets.push(moved.path);
        // 2) บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
        await this.QaFileService.createQaFile(
          {
            ...form,
            FILE_TYPECODE: 'ESF',
            FILE_TYPENO: 1,
            FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
            FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
            FILE_USERCREATE: dto.REQUESTER,
            FILE_PATH: destination, // โฟลเดอร์ปลายทาง
          },
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Request successful',
        // files: moveFile,
        data: dto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      await Promise.allSettled([
        ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
        ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
      ]);
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async getFormData(dto: QainsFormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsForm)
      : this.qaformRepo;

    return repo.findOne({
      where: {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      },
      relations: ['QA_AUD_OPT', 'QA_AUD_OPT.TYPE', 'QA_AUD_OPT.QOA_EMPNO_INFO', 'QA_FILES', 'QA_FILES.TYPE', 'QA_INCHARGE_INFO', 'QA_INCHARGE_SECTION_INFO'],
      order: {
        QA_AUD_OPT: { QOA_SEQ: 'ASC' }, // แทน ORDER BY ใน subquery เดิม
        QA_FILES: { FILE_ID: 'ASC' },
      },
    });
  }

   async search(dto: SearchQainsFormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsForm)
      : this.qaformRepo;

    return repo.find({
      where: {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        QA_ITEM: dto.QA_ITEM,
        QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
        QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
      },
      relations: ['QA_AUD_OPT', 'QA_AUD_OPT.TYPE', 'QA_AUD_OPT.QOA_EMPNO_INFO', 'QA_FILES', 'QA_FILES.TYPE', 'QA_INCHARGE_INFO', 'QA_INCHARGE_SECTION_INFO'],
      order: {
        QA_AUD_OPT: { QOA_SEQ: 'ASC' }, // แทน ORDER BY ใน subquery เดิม
        QA_FILES: { FILE_ID: 'ASC' },
      },
    });
  }
}
