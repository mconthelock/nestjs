import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

@Controller('docinv/tasks')
export class TasksController {
    constructor(private readonly tasks: TasksService) {}

    @Post('search')
    search(@Body() searchTaskDto: SearchTaskDto) {
        return this.tasks.search(searchTaskDto);
    }

    @Post('create')
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasks.create(createTaskDto);
    }

    @Post('update/:id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasks.update(id, updateTaskDto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: string) {
        return this.tasks.delete(id);
    }
}
