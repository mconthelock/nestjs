import { Module } from '@nestjs/common';
import { SpecialuserModule } from './specialuser/specialuser.module';
import { OslogsModule } from './oslogs/oslogs.module';
import { DblogsModule } from './dblogs/dblogs.module';
import { ApplogsModule } from './applogs/applogs.module';
import { TasklogsModule } from './tasklogs/tasklogs.module';

@Module({
  imports: [
    SpecialuserModule,
    OslogsModule,
    DblogsModule,
    ApplogsModule,
    TasklogsModule,
  ],
})
export class ItgcModule {}
