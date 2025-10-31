import { Injectable } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { EscsUser } from './entities/user.entity';
import { SearchEscsUserDto } from './dto/search-escs-user.dto';
import {
  getSelectNestedFields,
  getSafeFields,
} from '../../common/utils/Fields.utils';
import { CreateEscsUserDto } from './dto/create-escs-user.dto';

@Injectable()
export class ESCSUserService {
  constructor(
    @InjectRepository(EscsUser, 'amecConnection')
    private userRepo: Repository<EscsUser>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  private escs = this.dataSource
    .getMetadata(EscsUser)
    .columns.map((c) => c.propertyName);
  private user = this.dataSource
    .getMetadata('AMECUSERALL')
    .columns.map((c) => c.propertyName);
  private allowFields = [...this.escs, ...this.user];

  getUserAll() {
    return this.userRepo.find({
      order: {
        USR_ID: 'ASC',
      },
    });
  }

  getUserByID(id: number) {
    return this.userRepo.findOne({
      where: { USR_ID: id },
      order: {
        USR_ID: 'ASC',
      },
    });
  }

  getUser(searchDto: SearchEscsUserDto, queryRunner?: QueryRunner) {
    const {
      USR_ID,
      USR_NO,
      GRP_ID,
      USR_STATUS,
      SEC_ID,
      fields = [],
    } = searchDto;
    const repo = queryRunner ? queryRunner.manager : this.dataSource;
    const query = repo.createQueryBuilder().from('ESCS_USERS', 'A');

    if (USR_ID) query.andWhere('A.USR_ID = :USR_ID', { USR_ID });
    if (USR_NO) query.andWhere('A.USR_NO = :USR_NO', { USR_NO });
    if (GRP_ID) query.andWhere('A.GRP_ID = :GRP_ID', { GRP_ID });
    if (USR_STATUS)
      query.andWhere('A.USR_STATUS = :USR_STATUS', { USR_STATUS });
    if (SEC_ID) query.andWhere('A.SEC_ID = :SEC_ID', { SEC_ID });

    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.allowFields);
    } else {
      select = this.allowFields;
    }

    select.forEach((f) => {
      if (this.user.includes(f)) {
        query.addSelect(`B.${f}`, f);
      } else {
        query.addSelect(`A.${f}`, f);
      }
    });
    query.leftJoin('AMECUSERALL', 'B', 'A.USR_NO = B.SEMPNO');
    query.andWhere('B.CSTATUS = 1');
    query.orderBy('A.USR_NO', 'ASC');
    return query.getRawMany();
  }

  async addUser(dto: CreateEscsUserDto, queryRunner?: QueryRunner) {
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

      await runner.manager.insert(EscsUser, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert user Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert user ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
