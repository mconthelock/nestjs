import { Module } from '@nestjs/common';
import { FlowmstService } from './flowmst.service';
import { FlowmstController } from './flowmst.controller';

@Module({
  controllers: [FlowmstController],
  providers: [FlowmstService],
})
export class FlowmstModule {}
