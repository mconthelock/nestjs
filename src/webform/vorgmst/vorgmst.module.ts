import { Module } from '@nestjs/common';
import { VorgmstService } from './vorgmst.service';
import { VorgmstController } from './vorgmst.controller';

@Module({
  controllers: [VorgmstController],
  providers: [VorgmstService],
})
export class VorgmstModule {}
