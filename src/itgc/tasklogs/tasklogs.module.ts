import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasklogsService } from './tasklogs.service';
import { TasklogsController } from './tasklogs.controller';

import { WSDTaskLog } from './entities/wsd.entity';
import { AASTaskLog } from './entities/aas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WSDTaskLog], 'auditConnection'),
    TypeOrmModule.forFeature([AASTaskLog], 'docinvConnection'),
  ],
  controllers: [TasklogsController],
  providers: [TasklogsService],
})
export class TasklogsModule {}
