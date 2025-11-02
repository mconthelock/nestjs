import { Module } from '@nestjs/common';
import { OslogsService } from './oslogs.service';
import { OslogsController } from './oslogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Windows } from './entities/windows.entity';
import { SpecialuserModule } from '../specialuser/specialuser.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Windows], 'auditConnection'),
    SpecialuserModule,
  ],
  controllers: [OslogsController],
  providers: [OslogsService],
})
export class OslogsModule {}
