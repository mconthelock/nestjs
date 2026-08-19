import { Module } from '@nestjs/common';
import { ShortageService } from './shortage.service';
import { ShortageController } from './shortage.controller';
import { ShortageRepository } from './shortage.repository';

@Module({
  controllers: [ShortageController],
  providers: [ShortageService,ShortageRepository],
})
export class ShortageModule {}
