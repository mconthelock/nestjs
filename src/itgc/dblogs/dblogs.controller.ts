import { Controller } from '@nestjs/common';
import { DblogsService } from './dblogs.service';

@Controller('itgc/dblogs')
export class DblogsController {
  constructor(private readonly dblogsService: DblogsService) {}
}
