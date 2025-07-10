import { Controller, Get, Param } from '@nestjs/common';
import { WorkpicService } from './workpic.service';

@Controller('workplan/incharge')
export class WorkpicController {
  constructor(private readonly pic: WorkpicService) {}
}
