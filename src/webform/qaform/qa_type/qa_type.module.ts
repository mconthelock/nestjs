import { Module } from '@nestjs/common';
import { QaTypeService } from './qa_type.service';
import { QaTypeController } from './qa_type.controller';
import { QaType } from './entities/qa_type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QaType], 'webformConnection')],
  controllers: [QaTypeController],
  providers: [QaTypeService],
})
export class QaTypeModule {}
