import { Module } from '@nestjs/common';
import { QaCnService } from './qa-cn.service';
import { QaCnController } from './qa-cn.controller';
import { CnformModule } from './cnform/cnform.module';
import { ResultchkdwgModule } from './resultchkdwg/resultchkdwg.module';
import { AttcnfrmModule } from './attcnfrm/attcnfrm.module';

@Module({
  controllers: [QaCnController],
  providers: [QaCnService],
  imports: [CnformModule, ResultchkdwgModule, AttcnfrmModule],
})
export class QaCnModule {}
