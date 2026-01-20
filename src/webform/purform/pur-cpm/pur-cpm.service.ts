import { Injectable } from '@nestjs/common';
import { CreatePurCpmDto, InsertPurCpmDto } from './dto/create-pur-cpm.dto';
import { UpdatePurCpmDto } from './dto/update-pur-cpm.dto';
import { PURCPM_FORM } from 'src/common/Entities/webform/tables/PURCPM_FORM.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { FormService } from 'src/webform/form/form.service';
import {
  deleteFile,
  joinPaths,
  moveFileFromMulter,
} from 'src/common/utils/files.utils';
import { PurFileService } from '../pur-file/pur-file.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { RepService } from 'src/webform/rep/rep.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';

@Injectable()
export class PurCpmService {
  constructor(
    @InjectRepository(PURCPM_FORM, 'webformConnection')
    private readonly repo: Repository<PURCPM_FORM>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private readonly formService: FormService,
    private readonly flowService: FlowService,
    private readonly formmstService: FormmstService,   
    private readonly purFileService: PurFileService,
    private readonly repService: RepService,
  ) {}

  async create(
    dto: CreatePurCpmDto,
    files: Express.Multer.File[],
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const { THIRD_PARTY, REQBY, INPUTBY, REMARK, ...data } = dto;

      // 1. สร้าง Form ก่อน
      const createForm = await this.formService.create(
        {
          NFRMNO: dto.NFRMNO,
          VORGNO: dto.VORGNO,
          CYEAR: dto.CYEAR,
          REQBY: dto.REQBY,
          INPUTBY: dto.INPUTBY,
          REMARK: dto.REMARK,
        },
        ip,
        queryRunner,
      );

      if (!createForm.status) {
        throw new Error(createForm.message.message);
      }

      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: createForm.data.CYEAR2,
        NRUNNO: createForm.data.NRUNNO,
      };

      // 2. หากมี THIRD_PARTY ให้เพิ่ม flow cstepno 40
      if (THIRD_PARTY) {
        const formmst = await this.formmstService.getFormMasterByVaname('PUR-CPM');
        const represent = await this.repService.getRepresent(
          {
            NFRMNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
            VEMPNO: THIRD_PARTY,
          },
          queryRunner,
        );
        console.log(represent);
        

        await this.flowService.updateFlow({
            condition: {
                ...form,
                CSTEPNO: '--',
            },
            CSTEPNEXTNO: '40',
        }, queryRunner);
        await this.flowService.insertFlow({
          ...form,
          CSTEPNO: '40',
          CSTEPNEXTNO: '06',
          CSTART: '0',
          CSTEPST: '2',
          CTYPE: '3',
          VPOSNO: '30',
          VAPVNO: THIRD_PARTY,
          VREPNO: represent,
          CAPVSTNO: '0',
          CAPVTYPE: '1',
          CAPPLYALL: '0',
          VURL: formmst?.VFORMPAGE || '',
        }, queryRunner);
    //   throw new Error('Test rollback');

        await this.flowService.resetFlow(form, queryRunner)
      }

      // 3. เมื่อ PAYMENT ต่ำกว่า 10,000 ให้ลบ flow ddim, dim ออก
      if (data.PAYMENT < 10000) {
        await this.flowService.deleteFlowStep(
          { ...form, CSTEPNO: '01' },
          queryRunner,
        );
        await this.flowService.deleteFlowStep(
          { ...form, CSTEPNO: '02' },
          queryRunner,
        );
      }

      // 4. บันทึกข้อมูล PUR-CPM

      await this.insert(
        {
          CYEAR2: form.CYEAR2,
          NRUNNO: form.NRUNNO,
          ...data,
        },
        queryRunner,
      );

      // 5. ย้ายไฟล์ไปยังปลายทาง
      const formNo = await this.formService.getFormno(form); // Get the form number
      const destination = await joinPaths(path, formNo); // Get the destination path
      for (const file of files) {
        const moved = await moveFileFromMulter(file, destination);
        movedTargets.push(moved.path);
        // 6. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
        await this.purFileService.insert(
          {
            ...form,
            FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
            FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
            FILE_USERCREATE: dto.REQBY,
            FILE_PATH: destination, // โฟลเดอร์ปลายทาง
          },
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Request successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await Promise.allSettled([
        ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
        ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
      ]);
      throw new Error('Create PUR-CPM Form Error: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async insert(data: InsertPurCpmDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.insert(PURCPM_FORM, data);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert IS-ADP Form Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert IS-ADP Form Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
