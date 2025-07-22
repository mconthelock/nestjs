

import { Module } from '@nestjs/common';
import { QaTypeModule } from './qa_type/qa_type.module';
import { QaFileModule } from './qa_file/qa_file.module';
import { QAInsModule } from './qa-ins/qains.module';

@Module({
  imports: [QaFileModule, QaTypeModule, QAInsModule],
})
export class QAFormModule {}
