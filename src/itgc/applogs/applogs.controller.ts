import { Controller } from '@nestjs/common';
import { ApplogsService } from './applogs.service';

@Controller('itgc/applogs')
export class ApplogsController {
  constructor(private readonly applogsService: ApplogsService) {}
}
