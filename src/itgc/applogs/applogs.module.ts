import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplogsService } from './applogs.service';
import { ApplogsController } from './applogs.controller';

import { SpecialuserModule } from '../specialuser/specialuser.module';
import { AS400Log } from './entities/as400.entity';
import { AMECLog } from './entities/amec.entity';
import { ISOLog } from './entities/iso.entity';
import { SCMLog } from './entities/scm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AMECLog], 'auditConnection'),
    TypeOrmModule.forFeature([ISOLog], 'auditConnection'),
    TypeOrmModule.forFeature([SCMLog], 'auditConnection'),
    TypeOrmModule.forFeature([AS400Log], 'auditConnection'),
    SpecialuserModule,
  ],
  controllers: [ApplogsController],
  providers: [ApplogsService],
})
export class ApplogsModule {}
