import { Module } from '@nestjs/common';
import { QaFileService } from './qa_file.service';
import { QaFileController } from './qa_file.controller';

@Module({
  controllers: [QaFileController],
  providers: [QaFileService],
})
export class QaFileModule {}
