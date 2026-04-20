import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasklogsService } from './tasklogs.service';
import { TasklogsController } from './tasklogs.controller';

import { WSDTaskLog } from './entities/wsd.entity';
import { AASTaskLog } from './entities/aas.entity';
import { TaskLogs } from './entities/tasklogs.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([WSDTaskLog], 'auditConnection'),
        TypeOrmModule.forFeature([AASTaskLog], 'docinvConnection'),
        TypeOrmModule.forFeature([TaskLogs], 'webformConnection'),
    ],
    controllers: [TasklogsController],
    providers: [TasklogsService],
})
export class TasklogsModule {}
