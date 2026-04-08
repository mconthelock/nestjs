import { Module } from '@nestjs/common';
import { QainsOAService } from './qains_operator_auditor.service';
import { QainsOAController } from './qains_operator_auditor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QAINS_OPERATOR_AUDITOR } from 'src/common/Entities/webform/table/QAINS_OPERATOR_AUDITOR.entity';
import { QainsOARepository } from './qains_operator_auditor.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([QAINS_OPERATOR_AUDITOR], 'webformConnection'),
    ],
    controllers: [QainsOAController],
    providers: [QainsOAService, QainsOARepository],
    exports: [QainsOAService],
})
export class QainsOAModule {}
