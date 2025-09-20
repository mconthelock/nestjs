import { Controller } from '@nestjs/common';
import { Form1WageService } from './form1-wage.service';

@Controller('form/is/form1/wage')
export class Form1WageController {
  constructor(private readonly wage: Form1WageService) {}
}
