import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';

import { ApplicationModule } from '../application/application.module';

@Module({
  controllers: [SourceController],
  providers: [SourceService],
  imports: [ApplicationModule],
})
export class SourceModule {}
