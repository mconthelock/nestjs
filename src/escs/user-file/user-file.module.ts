import { Module } from '@nestjs/common';
import { ESCSUserFileService } from './user-file.service';
import { ESCSUserFileController } from './user-file.controller';

@Module({
  controllers: [ESCSUserFileController],
  providers: [ESCSUserFileService],
})
export class ESCSUserFileModule {}
