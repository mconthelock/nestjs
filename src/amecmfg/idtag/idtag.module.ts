import { Module } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { IdtagController } from './idtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M008KP } from 'src/amecmfg/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/amecmfg/f001kp/entities/f001kp.entity';
import { F002KP } from 'src/amecmfg/f002kp/entities/f002kp.entity';
import { F003KP } from 'src/amecmfg/f003kp/entities/f003kp.entity';
import { Q90010P2 } from 'src/as400/rtnlibf/q90010p2/entities/q90010p2.entity';
import { FileLoggerModule } from 'src/common/services/file-logger/file-logger.module';
import { R027mp1Module } from 'src/as400/rtnlibf/r027mp1/r027mp1.module';
import { T002kpModule } from 'src/as400/rtnlibf/t002kp/t002kp.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { ConectionModule } from 'src/as400/conection/conection.module';

import { IdTagRepository } from './printed/idtag.repository';
import { IdtagList } from '../../common/Entities/workload/table/idtag-list.entity';
import { IdtagFiles } from '../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../common/Entities/workload/table/idtag-pages.entity';
import { IdtagImages } from '../../common/Entities/workload/views/idtag-images.entity';
import { IdtagOrders } from '../../common/Entities/workload/table/IDTAGS_ORDERS.entity';

import { PrintedService } from './printed/printed.service';
import { PrintedQueueService } from './printed/PrintedQueue.service';
import { PrintedImagesService } from './printed/printedImage.service';
import { PrintedCnService } from './printed/printedCn.service';
import { PrintedMergeService } from './printed/printedMerge.service';
import { PrintedNcService } from './printed/printedNc.service';
import { PrintedTopLabelService } from './printed/printedTopLabel.service';
import { PrintedExtractService } from './printed/printedExtract.service';

@Module({
    imports: [
        FileLoggerModule,
        R027mp1Module,
        T002kpModule,
        MailModule,
        ConectionModule,
        TypeOrmModule.forFeature(
            [M008KP, F110KP, F001KP, F002KP, F003KP, Q90010P2],
            'datacenterConnection',
        ),
        TypeOrmModule.forFeature(
            [IdtagFiles, IdtagPages, IdtagImages, IdtagList, IdtagOrders],
            'mitsuConnection',
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
        PrintedExtractService,
    ],
})
export class IdtagModule {}
