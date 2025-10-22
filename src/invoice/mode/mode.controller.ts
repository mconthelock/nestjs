import { Controller } from '@nestjs/common';
import { ModeService } from './mode.service';

@Controller('mode')
export class ModeController {
  constructor(private readonly modeService: ModeService) {}
}
