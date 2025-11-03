import { Body, Controller, Post } from '@nestjs/common';
import { TasklogsService } from './tasklogs.service';
import { searchTasklogs } from './dto/search.dto';

@Controller('itgc/tasklogs')
export class TasklogsController {
  constructor(private readonly task: TasklogsService) {}

  @Post('search')
  async search(@Body() data: searchTasklogs) {
    return this.task.search(data);
  }
}
