import { Module } from '@nestjs/common';
import { IdtagEfacLogService } from './idtag-efac-log.service';
import { IdtagEfacLogController } from './idtag-efac-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDTAG_EFAC_LOG } from 'src/common/Entities/workload/table/IDTAG_EFAC_LOG.entity';
import { IdtagEfacLogRepository } from './idtag-efac-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IDTAG_EFAC_LOG], 'workloadConnection')],
  controllers: [IdtagEfacLogController],
  providers: [IdtagEfacLogService, IdtagEfacLogRepository],
  exports: [IdtagEfacLogService],
})
export class IdtagEfacLogModule {}
