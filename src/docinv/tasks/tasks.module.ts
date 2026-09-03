import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

import { Tasks } from 'src/common/Entities/docinv/table/TASKS.entity';
import { TasksTag } from 'src/common/Entities/docinv/table/TASKS_TAG.entity';
import { Tags } from 'src/common/Entities/docinv/table/TAGS.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tasks, Tags, TasksTag], 'docinvConnection'),
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
