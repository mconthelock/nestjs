import { Module } from '@nestjs/common';
import { PvenderService } from './pvender.service';
import { PvenderController } from './pvender.controller';

@Module({
  controllers: [PvenderController],
  providers: [PvenderService],
})
export class PvenderModule {}
