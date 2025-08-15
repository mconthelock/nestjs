import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaFileService } from './qa_file.service';
import { QaFileController } from './qa_file.controller';
import { QaFile } from './entities/qa_file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QaFile], 'amecConnection')],
  controllers: [QaFileController],
  providers: [QaFileService],
  exports: [QaFileService],
})
export class QaFileModule {}
