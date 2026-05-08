import { Body, Controller, Post } from '@nestjs/common';
import { ApplogsService } from './applogs.service';
import { searchApplogs } from './dto/search.dto';

@Controller('itgc/applogs')
export class ApplogsController {
  constructor(private readonly apps: ApplogsService) {}

  @Post('search')
  async search(@Body() data: searchApplogs) {
    return this.apps.search(data);
  }
}
