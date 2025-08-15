import { Module } from '@nestjs/common';
import { QainsOAService } from './qains_operator_auditor.service';
import { QainsOAController } from './qains_operator_auditor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QainsOA } from './entities/qains_operator_auditor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QainsOA], 'amecConnection')],
  controllers: [QainsOAController],
  providers: [QainsOAService],
  exports: [QainsOAService],
})
export class QainsOAModule {}
