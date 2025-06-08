import { Module } from '@nestjs/common';
import { AppsmenuusersService } from './appsmenuusers.service';
import { AppsmenuusersController } from './appsmenuusers.controller';

@Module({
  controllers: [AppsmenuusersController],
  providers: [AppsmenuusersService],
})
export class AppsmenuusersModule {}
