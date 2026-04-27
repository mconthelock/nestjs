import { Module } from '@nestjs/common';
import { FinDsService } from './fin-ds.service';
import { FinDsController } from './fin-ds.controller';

@Module({
  controllers: [FinDsController],
  providers: [FinDsService],
})
export class FinDsModule {}
