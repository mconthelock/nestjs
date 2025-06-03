import { Module } from '@nestjs/common';
import { AppsmenuService } from './appsmenu.service';
import { AppsmenuController } from './appsmenu.controller';

@Module({
  controllers: [AppsmenuController],
  providers: [AppsmenuService],
})
export class AppsmenuModule {}
