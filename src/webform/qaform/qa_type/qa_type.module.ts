import { Module } from '@nestjs/common';
import { QaTypeService } from './qa_type.service';
import { QaTypeController } from './qa_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QA_TYPE } from 'src/common/Entities/webform/table/QA_TYPE.entity';
import { QaTypeRepository } from './qa_type.repository';

@Module({
    imports: [TypeOrmModule.forFeature([QA_TYPE], 'webformConnection')],
    controllers: [QaTypeController],
    providers: [QaTypeService, QaTypeRepository],
    exports: [QaTypeService],
})
export class QaTypeModule {}