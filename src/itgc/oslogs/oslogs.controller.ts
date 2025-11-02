import { Body, Controller, Post } from '@nestjs/common';
import { OslogsService } from './oslogs.service';
import { searchOslogs } from './dto/search.dto';

@Controller('itgc/oslogs')
export class OslogsController {
  constructor(private readonly os: OslogsService) {}

  @Post('search')
  async searchOslogs(@Body() data: searchOslogs) {
    return this.os.searchOslogs(data);
  }
}
