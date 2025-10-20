import { Module } from '@nestjs/common';
import { TwidocService } from './twidoc.service';
import { TwidocController } from './twidoc.controller';
import { MasterkeyModule } from '../masterkey/masterkey.module';

@Module({
  imports: [MasterkeyModule],
  controllers: [TwidocController],
  providers: [TwidocService],
})
export class TwidocModule {}
