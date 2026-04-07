import { Controller } from '@nestjs/common';
import { BackgroundTaskService } from './background-task.service';

@Controller('background-task')
export class BackgroundTaskController {
  constructor(private readonly backgroundTaskService: BackgroundTaskService) {}
}
