import { Body, Controller, Post } from '@nestjs/common';
import { DblogsService } from './dblogs.service';
import { searchDblogs } from './dto/search.dto';

@Controller('itgc/dblogs')
export class DblogsController {
  constructor(private readonly dblog: DblogsService) {}

  @Post('search')
  async search(@Body() data: searchDblogs) {
    return this.dblog.search(data);
  }
}
