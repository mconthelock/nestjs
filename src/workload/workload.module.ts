import { Module } from '@nestjs/common';
import { IdtagEfacLogModule } from './idtag-efac-log/idtag-efac-log.module';

@Module({
  imports: [IdtagEfacLogModule],
})
export class WorkloadModule {}
