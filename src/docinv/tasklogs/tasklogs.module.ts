import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasklogsService } from './tasklogs.service';
import { TasklogsController } from './tasklogs.controller';

import { WSDTaskLog } from '../../common/Entities/docinv/views/wsdtasklog.entity';
import { AASTaskLog } from '../../common/Entities/docinv/views/aastasklog.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([WSDTaskLog], 'auditConnection'),
        TypeOrmModule.forFeature([AASTaskLog], 'docinvConnection'),
    ],
    controllers: [TasklogsController],
    providers: [TasklogsService],
})
export class TasklogsModule {}
