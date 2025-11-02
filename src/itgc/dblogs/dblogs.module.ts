import { Module } from '@nestjs/common';
import { DblogsService } from './dblogs.service';
import { DblogsController } from './dblogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialuserModule } from '../specialuser/specialuser.module';
import { ISOLog } from './entities/iso.entity';
import { AMECLog } from './entities/amec.entity';
import { LnLog } from './entities/ln.entity';
import { SCMLog } from './entities/scm.entity';
import { Windows } from '../oslogs/entities/windows.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([AMECLog], 'auditConnection'),
    TypeOrmModule.forFeature([ISOLog], 'auditConnection'),
    TypeOrmModule.forFeature([LnLog], 'auditConnection'),
    TypeOrmModule.forFeature([SCMLog], 'auditConnection'),
    TypeOrmModule.forFeature([Windows], 'auditConnection'),
    SpecialuserModule,
  ],
  controllers: [DblogsController],
  providers: [DblogsService],
})
export class DblogsModule {}
