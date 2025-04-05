import { Module } from '@nestjs/common';
import { PsectionService } from './psection.service';
import { PsectionController } from './psection.controller';

@Module({
  controllers: [PsectionController],
  providers: [PsectionService],
})
export class PsectionModule {}
