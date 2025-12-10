import { Injectable } from '@nestjs/common';
import { CreateIsAdpDto, insertIsAdpDto } from './dto/create-is-adp.dto';
import { UpdateIsAdpDto } from './dto/update-is-adp.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IsAdp } from './entities/is-adp.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { FormService } from 'src/webform/form/form.service';
import { deleteFile, moveFileFromMulter } from 'src/common/utils/files.utils';
import { IsFileService } from '../is-file/is-file.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class IsAdpService {
  constructor(
    @InjectRepository(IsAdp, 'webformConnection')
    private readonly isAdpRepo: Repository<IsAdp>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private readonly formService: FormService,
    private readonly isFileService: IsFileService,
  ) {}

  async getData(dto: FormDto) {
    // return this.dataSource.createQueryBuilder().from('AMEC.PDIVISION', 'a').getRawMany();
    return this.dataSource.createQueryBuilder()
    .from('ISADP_FORM', 'a')
    .select([
        '"a"."NFRMNO"', 
        '"a"."VORGNO"', 
        '"a"."CYEAR"', 
        '"a"."CYEAR2"', 
        '"a"."NRUNNO"', 
        '"a"."PLANYEAR"',
        '"a"."REQ_DIV"',
        '"a"."USER_REQ"',
        '"a"."DEV_PLAN"',
        '"a"."MANHOUR" as "MH"',
        '"a"."COST"',
        '"b"."SDIV"'
    ])
    .where('a.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
    .andWhere('a.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
    .andWhere('a.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
    .andWhere('a.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
    .andWhere('a.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
    .leftJoin(qb => qb.from('AMEC.PDIVISION', 'b'), 'b', 'a.REQ_DIV ="b"."SDIVCODE"')
    .orderBy('a.REQ_DIV', 'ASC')
    .getRawMany();
  }

  async create(
    dto: CreateIsAdpDto,
    file: Express.Multer.File,
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    let movedTargets: string; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 1. สร้าง Form ก่อน
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
        throw new Error(createForm.message.message);
      }
      // 2. บันทึกข้อมูล IS-ADP
      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: createForm.data.CYEAR2,
        NRUNNO: createForm.data.NRUNNO,
      };

      await this.insert(form, dto.data, queryRunner);

      // 3. ย้ายไฟล์ไปยังปลายทาง
      const formNo = await this.formService.getFormno(form); // Get the form number
      const destination = path + '/' + formNo; // Get the destination path
      const moved = await moveFileFromMulter(file, destination);
      movedTargets = moved.path;
      // 4. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
      await this.isFileService.insert(
        {
          ...form,
          FILE_ONAME: file.originalname,
          FILE_FNAME: moved.newName,
          FILE_USERCREATE: dto.REQUESTER,
          FILE_PATH: destination,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Request successful'
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await deleteFile(movedTargets); // ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
      await deleteFile(file.path); // ลบไฟล์ใน tmp ออก
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async insert(form: any, data: insertIsAdpDto[], queryRunner?: QueryRunner) {
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

      const dataInsert = data.map((d) => {
        return {
          ...form,
          ...d,
        };
      });

      const res = await runner.manager.insert(IsAdp, dataInsert);
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
