import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplogsService } from './applogs.service';
import { ApplogsController } from './applogs.controller';
import { SpecialuserModule } from '../specialuser/specialuser.module';

import { AmecappLog } from 'src/common/Entities/docinv/views/amecapp.entity';
import { As400appLog } from 'src/common/Entities/docinv/views/as400app.entity';
import { IsoAppLog } from 'src/common/Entities/docinv/views/isoapp.entity';
import { ScmappLog } from 'src/common/Entities/docinv/views/scmapp.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AmecappLog], 'docinvConnection'),
        TypeOrmModule.forFeature(
            [IsoAppLog, ScmappLog, As400appLog],
            'auditConnection',
        ),
        SpecialuserModule,
    ],
    controllers: [ApplogsController],
    providers: [ApplogsService],
})
export class ApplogsModule {}
