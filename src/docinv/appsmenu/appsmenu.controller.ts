import { Controller } from '@nestjs/common';
import { AppsmenuService } from './appsmenu.service';

@Controller('appsmenu')
export class AppsmenuController {
  constructor(private readonly appsmenuService: AppsmenuService) {}
}
