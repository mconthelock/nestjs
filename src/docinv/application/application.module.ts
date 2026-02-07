import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application } from './entities/application.entity';
import { AppsgroupsModule } from '../appsgroups/appsgroups.module';

@Module({
  imports: [
    AppsgroupsModule,
    TypeOrmModule.forFeature([Application], 'docinvConnection'),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
