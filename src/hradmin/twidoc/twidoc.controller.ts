import { Controller, Post } from '@nestjs/common';
import { TwidocService } from './twidoc.service';

@Controller('hradmin/twidoc')
export class TwidocController {
  constructor(private readonly docs: TwidocService) {}

  @Post('all')
  findAll() {
    return this.docs.findAll();
  }
}
