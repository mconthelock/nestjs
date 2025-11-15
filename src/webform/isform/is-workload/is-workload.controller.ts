import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsWorkloadService } from './is-workload.service';
import { SearchWorkloadDto } from './dto/search.dto';

@Controller('form/is/workload')
export class IsWorkloadController {
  constructor(private readonly works: IsWorkloadService) {}

  @Post('/search')
  async searchWorkload(@Body() searchDto: SearchWorkloadDto) {
    return this.works.searchWorkload(searchDto);
  }

  @Get('/liststatus')
  async listStatus() {
    return this.works.listStatus();
  }
}
