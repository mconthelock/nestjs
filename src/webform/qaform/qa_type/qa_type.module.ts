import { Module } from '@nestjs/common';
import { QaTypeService } from './qa_type.service';
import { QaTypeController } from './qa_type.controller';

@Module({
  controllers: [QaTypeController],
  providers: [QaTypeService],
})
export class QaTypeModule {}
