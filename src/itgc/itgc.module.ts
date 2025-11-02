import { Module } from '@nestjs/common';
import { SpecialuserModule } from './specialuser/specialuser.module';
import { OslogsModule } from './oslogs/oslogs.module';
import { DblogsModule } from './dblogs/dblogs.module';
import { ApplogsModule } from './applogs/applogs.module';

@Module({
  imports: [SpecialuserModule, OslogsModule, DblogsModule, ApplogsModule],
})
export class ItgcModule {}
