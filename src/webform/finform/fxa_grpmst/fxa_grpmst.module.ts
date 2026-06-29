import { Module } from '@nestjs/common';
import { FxaGrpmstService } from './fxa_grpmst.service';
import { FxaGrpmstController } from './fxa_grpmst.controller';
import { FXAGRPRepository } from './fxa_grpmst.repository';

@Module({
  controllers: [FxaGrpmstController],
  providers: [FxaGrpmstService , FXAGRPRepository],
})
export class FxaGrpmstModule {}
