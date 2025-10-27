import { Module } from '@nestjs/common';
import { TwidocService } from './twidoc.service';
import { TwidocController } from './twidoc.controller';
import { JobTwiController } from './jobtwi.controller';
import { MasterkeyModule } from '../masterkey/masterkey.module';
import { DatabaseService } from '../shared/database.service';

@Module({
  imports: [MasterkeyModule],
  controllers: [TwidocController, JobTwiController],
  providers: [TwidocService, DatabaseService],
})
export class TwidocModule {}
