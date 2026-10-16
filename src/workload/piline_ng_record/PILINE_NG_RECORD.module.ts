import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_NG_RECORD } from 'src/common/Entities/workload/table/PILINE_NG_RECORD.entity';
import { PilineNgRecordController } from './PILINE_NG_RECORD.controller';
import { PilineNgRecordService } from './PILINE_NG_RECORD.service';
import { PilineNgRecordRepository } from './PILINE_NG_RECORD.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_NG_RECORD], 'workloadConnection'),
    ],
    controllers: [PilineNgRecordController],
    providers: [PilineNgRecordService, PilineNgRecordRepository],
    exports: [PilineNgRecordService],
})
export class PilineNgRecordModule {}
