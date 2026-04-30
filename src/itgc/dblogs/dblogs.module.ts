import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Amecdblog } from 'src/common/Entities/itgc/views/amecdb.entity';
import { IsodbLog } from 'src/common/Entities/itgc/views/isodb.entity';
import { LndbLog } from 'src/common/Entities/itgc/views/lndb.entity';
import { scmdbLog } from 'src/common/Entities/itgc/views/scmdb.entity';
import { AS400dbLog } from 'src/common/Entities/itgc/views/as400db.entrity';

import { SpecialuserModule } from '../specialuser/specialuser.module';
import { DblogsService } from './dblogs.service';
import { DblogsController } from './dblogs.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Amecdblog], 'docinvConnection'),
        TypeOrmModule.forFeature([LndbLog], 'lnConnection'),
        TypeOrmModule.forFeature(
            [IsodbLog, scmdbLog, AS400dbLog],
            'auditConnection',
        ),
        SpecialuserModule,
    ],
    controllers: [DblogsController],
    providers: [DblogsService],
})
export class DblogsModule {}
