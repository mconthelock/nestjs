import { Controller } from '@nestjs/common';
import { TwidocService } from './twidoc.service';

@Controller('twidoc')
export class TwidocController {
  constructor(private readonly twidocService: TwidocService) {}
}
