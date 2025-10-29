import { Injectable } from '@nestjs/common';
import { CreateMatrixEffectItemDto, MigrationMatrixItemEffectDto } from './dto/create-matrix-effect-item.dto';
import { UpdateMatrixEffectItemDto } from './dto/update-matrix-effect-item.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MatrixEffectItem } from './entities/matrix-effect-item.entity';

@Injectable()
export class MatrixEffectItemService {

    constructor(
        @InjectRepository(MatrixEffectItem, 'idsConnection')
        private readonly mteRepo: Repository<MatrixEffectItem>,
        @InjectDataSource('idsConnection')
        private readonly dataSource: DataSource,
      ) {}
    
      async migration(dto: MigrationMatrixItemEffectDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
          await queryRunner.connect();
          await queryRunner.startTransaction();
          for (const d of dto.data) {
            await this.insert(d, queryRunner);
          }
          if (queryRunner.isTransactionActive) {
            await queryRunner.commitTransaction();
          }
          return {
            status: true,
            message: 'Migration successful',
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new Error(error.message);
        } finally {
          await queryRunner.release();
        }
      }
    
      async insert(dto: CreateMatrixEffectItemDto, queryRunner?: QueryRunner) {
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
    
          await runner.manager.insert(MatrixEffectItem, dto);
          if (localRunner && didStartTx && runner.isTransactionActive)
            await localRunner.commitTransaction();
          return {
            status: true,
            message: 'Insert Matrix Effect Item Successfully',
          };
        } catch (error) {
          if (localRunner && didStartTx && localRunner.isTransactionActive)
            await localRunner.rollbackTransaction();
          throw new Error('Insert Matrix Effect Item Error: ' + error.message);
        } finally {
          if (localRunner && didConnect) await localRunner.release();
        }
      }
}
