import { Module } from '@nestjs/common';
import { ShortageService } from './shortage.service';
import { ShortageController } from './shortage.controller';
import { ShortageRepository } from './shortage.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SHORTAGE_ISSUE } from 'src/common/Entities/workload/views/SHORTAGE_ISSUE.entity';
import { VW_SHORTAGE_REPORT } from 'src/common/Entities/workload/views/SHORTAGE_REPORT.entity';
import { SHORT_PUR_TRACKING } from 'src/common/Entities/workload/table/SHORT_PUR_TRACKING.entity';

@Module({
    controllers: [ShortageController],
    providers: [ShortageService, ShortageRepository],
    imports: [
        TypeOrmModule.forFeature([
        SHORTAGE_ISSUE,
        VW_SHORTAGE_REPORT,
        SHORT_PUR_TRACKING,
    ], 'mitsuConnection'),ConectionModule],
})
export class ShortageModule {}
