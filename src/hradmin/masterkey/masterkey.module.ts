import { Module } from '@nestjs/common';
import { MasterkeyService } from './masterkey.service';
import { MasterkeyController } from './masterkey.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from '../shared/database.service';

@Module({
  imports: [AuthModule],
  controllers: [MasterkeyController],
  providers: [MasterkeyService, DatabaseService],
  exports: [MasterkeyService],
})
export class MasterkeyModule {}
