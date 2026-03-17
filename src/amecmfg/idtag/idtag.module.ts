import { Module } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { IdtagController } from './idtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';
import { FileLoggerModule } from 'src/common/services/file-logger/file-logger.module';
import { R027mp1Module } from 'src/as400/rtnlibf/r027mp1/r027mp1.module';
import { IdTagRepository } from './idtag.repository';

import { IdtagFiles } from '../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../common/Entities/workload/table/idtag-pages.entity';
import { IdtagImages } from '../../common/Entities/workload/views/idtag-images.entity';
@Module({
    imports: [
        FileLoggerModule,
        R027mp1Module,
        TypeOrmModule.forFeature([M008KP, F110KP, F001KP], 'amecConnection'),
        TypeOrmModule.forFeature(
            [IdtagFiles, IdtagPages, IdtagImages],
            'workloadConnection',
        ),
    ],
    controllers: [IdtagController],
    providers: [IdtagService, IdTagRepository],
})
export class IdtagModule {}
