import { Controller, Get } from '@nestjs/common';
import { Form1ObjectiveService } from './form1-objective.service';

@Controller('form/is/form1/objective')
export class Form1ObjectiveController {
  constructor(private readonly obj: Form1ObjectiveService) {}

  @Get('all')
  findAll() {
    return this.obj.findAll();
  }
}
