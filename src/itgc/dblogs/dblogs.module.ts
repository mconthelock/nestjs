import { Module } from '@nestjs/common';
import { DblogsService } from './dblogs.service';
import { DblogsController } from './dblogs.controller';

@Module({
  controllers: [DblogsController],
  providers: [DblogsService],
})
export class DblogsModule {}
