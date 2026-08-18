import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { Tasks } from 'src/common/Entities/docinv/table/TASKS.entity';
import { TasksTag } from 'src/common/Entities/docinv/table/TASKS_TAG.entity';
import { Tags } from 'src/common/Entities/docinv/table/TAGS.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks, 'docinvConnection')
        private readonly tasks: Repository<Tasks>,

        @InjectRepository(TasksTag, 'docinvConnection')
        private readonly tasksTag: Repository<TasksTag>,

        @InjectRepository(Tags, 'docinvConnection')
        private readonly tags: Repository<Tags>,
    ) {}

    async search(q: SearchTaskDto) {
        const qb = this.tasks
            .createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.tags', 'tags');
        await applyDynamicFilters(qb, q, 'tasks');
        return qb.getMany();
    }

    async create(dto: CreateTaskDto) {
        const defaultClasses = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
        ];
        const tags = (dto.TASK_DETAIL?.match(/#[\p{L}\p{N}_-]+/gu) ?? []).map(
            (tag: string) => tag.slice(1),
        );
        const task = this.tasks.create(dto);
        const savedTask = await this.tasks.save(task);

        if (tags.length) {
            for (const tagName of tags) {
                let tag = await this.tags.findOne({
                    where: { TAG_NAME: tagName },
                });

                if (!tag) {
                    const randomClass =
                        defaultClasses[
                            Math.floor(Math.random() * defaultClasses.length)
                        ];
                    tag = await this.tags.save(
                        this.tags.create({
                            TAG_NAME: tagName.toLowerCase(),
                            TAG_STYLE: randomClass,
                        }),
                    );
                }

                await this.tasksTag.save(
                    this.tasksTag.create({
                        TASK_ID: savedTask.TASK_ID,
                        TAG_ID: tag.TAG_ID,
                    }),
                );
            }
        }

        return { ...savedTask, tags };
    }
}
