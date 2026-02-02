import { Inject, Injectable } from '@nestjs/common';
import { CreatePprbiddingDto } from './dto/create-pprbidding.dto';
import { UpdatePprbiddingDto } from './dto/update-pprbidding.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PPRBIDDING } from 'src/common/Entities/amec/table/PPRBIDDING.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class PprbiddingService {
  constructor(
    @InjectRepository(PPRBIDDING, 'webformConnection')
    private repo: Repository<PPRBIDDING>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}
  
  async create(dto: CreatePprbiddingDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.save(PPRBIDDING, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert PPRBIDDING Successfully',
        data: res,
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error(
        'Insert PPRBIDDING Error: ' + error.message,
      );
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  findAll() {
    return this.repo.find();
  }

  search(dto: UpdatePprbiddingDto){
    return this.repo.findBy({
      ...dto
    });
  }
}
