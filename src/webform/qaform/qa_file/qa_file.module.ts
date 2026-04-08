import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaFileService } from './qa_file.service';
import { QaFileController } from './qa_file.controller';
import { QaFileRepository } from './qa_file.repository';
import { QA_FILE } from 'src/common/Entities/webform/table/QA_FILE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([QA_FILE], 'webformConnection')],
    controllers: [QaFileController],
    providers: [QaFileService, QaFileRepository],
    exports: [QaFileService],
})
export class QaFileModule {}
