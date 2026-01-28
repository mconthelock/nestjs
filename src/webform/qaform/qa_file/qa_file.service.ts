import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQaFileDto } from './dto/create-qa_file.dto';
import { UpdateQaFileDto } from './dto/update-qa_file.dto';
import { SearchQaFileDto } from './dto/search-qa_file.dto';
import { QaFile } from './entities/qa_file.entity';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class QaFileService {
  constructor(
    @InjectRepository(QaFile, 'webformConnection')
    private readonly qaformRepo: Repository<QaFile>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  async getQaFile(dto: SearchQaFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QaFile)
      : this.qaformRepo;
    return repo.find({
      where: dto,
      order: {
        FILE_ID: 'ASC',
      },
    });
  }

  async getQaFileByID(dto: SearchQaFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QaFile)
      : this.qaformRepo;
    return repo.findOne({
      where: {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        FILE_TYPECODE: dto.FILE_TYPECODE,
        FILE_ID: dto.FILE_ID,
      },
      order: {
        FILE_ID: 'ASC',
      },
    });
  }

  async createQaFile(dto: CreateQaFileDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const condition = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        FILE_TYPECODE: dto.FILE_TYPECODE,
      };
      const id = await this.setId(condition, runner);
      const data = {
        ...dto,
        FILE_ID: id,
      };

      await runner.manager.insert(QaFile, data);
      if (localRunner) await localRunner.commitTransaction();
      return { status: true, message: 'Inserted Successfully' };
    } catch (error) {
      if (localRunner) {
        await localRunner.rollbackTransaction();
        return { status: false, message: 'Error: ' + error.message };
      } else {
        throw error;
      }
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async delete(dto: UpdateQaFileDto, queryRunner?: QueryRunner) {
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
      const condition = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        FILE_TYPECODE: dto.FILE_TYPECODE,
      };
      if (dto.FILE_ID !== undefined) condition['FILE_ID'] = dto.FILE_ID;

      await runner.manager.delete(
        QaFile,
        condition,
      );
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

  async setId(dto: SearchQaFileDto, queryRunner?: QueryRunner) {
    const lastID = queryRunner
      ? await this.getNextSeq(dto, queryRunner)
      : await this.getNextSeq(dto);
    if (lastID.length > 0) {
      return lastID[0].FILE_ID + 1;
    } else {
      return 1;
    }
  }

  async getNextSeq(dto: SearchQaFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QaFile)
      : this.qaformRepo;
    return repo.find({
      where: dto,
      order: {
        FILE_ID: 'DESC',
      },
      take: 1,
    });
  }

  async moveAndInsertFiles(d: {
    files: Express.Multer.File[];
    form: FormDto;
    path: string;
    folder: string;
    typecode: string; //'ESF', 'ESI'
    requestedBy: string;
    ext1?: number;
    ext2?: string;
    queryRunner?: QueryRunner;
  }) {
    // const path = d.path.endsWith('/') ? d.path : d.path + '/';
    const destination = d.folder ? await joinPaths(d.path, d.folder) : d.path; // Get the destination path
    const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    for (const file of d.files) {
      const moved = await moveFileFromMulter({file, destination});
      movedTargets.push(moved.path);
      await this.createQaFile(
        {
          ...d.form,
          FILE_TYPECODE: d.typecode,
          FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
          FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
          FILE_USERCREATE: d.requestedBy,
          FILE_PATH: destination, // โฟลเดอร์ปลายทาง
          FILE_EXTRA_KEY1: d.ext1 ?? null,
          FILE_EXTRA_KEY2: d.ext2 ?? null,
        },
        d.queryRunner,
      );
    }
    return movedTargets;
  }
}
