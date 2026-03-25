import { Module } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { IdtagController } from './idtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';
import { FileLoggerModule } from 'src/common/services/file-logger/file-logger.module';
import { R027mp1Module } from 'src/as400/rtnlibf/r027mp1/r027mp1.module';
import { MailModule } from 'src/common/services/mail/mail.module';

import { IdTagRepository } from './printed/idtag.repository';
import { IdtagList } from '../../common/Entities/workload/table/idtag-list.entity';
import { IdtagFiles } from '../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../common/Entities/workload/table/idtag-pages.entity';
import { IdtagImages } from '../../common/Entities/workload/views/idtag-images.entity';

import { PrintedService } from './printed/printed.service';
import { PrintedQueueService } from './printed/PrintedQueue.service';
import { PrintedImagesService } from './printed/printedImage.service';
import { PrintedCnService } from './printed/printedCn.service';
import { PrintedMergeService } from './printed/printedMerge.service';
import { PrintedNcService } from './printed/printedNc.service';
import { PrintedTopLabelService } from './printed/printedTopLabel.service';

@Module({
    imports: [
        FileLoggerModule,
        R027mp1Module,
        MailModule,
        TypeOrmModule.forFeature([M008KP, F110KP, F001KP], 'amecConnection'),
        TypeOrmModule.forFeature(
            [IdtagFiles, IdtagPages, IdtagImages, IdtagList],
            'workloadConnection',
        ),
    ],
    controllers: [IdtagController],
    providers: [
        IdtagService,
        IdTagRepository,
        PrintedService,
        PrintedQueueService,
        PrintedImagesService,
        PrintedCnService,
        PrintedMergeService,
        PrintedNcService,
        PrintedTopLabelService,
    ],
})
export class IdtagModule {}
