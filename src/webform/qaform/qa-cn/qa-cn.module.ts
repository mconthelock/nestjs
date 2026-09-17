import { Module } from '@nestjs/common';
import { QaCnService } from './qa-cn.service';
import { QaCnController } from './qa-cn.controller';

@Module({
  controllers: [QaCnController],
  providers: [QaCnService],
})
export class QaCnModule {}
