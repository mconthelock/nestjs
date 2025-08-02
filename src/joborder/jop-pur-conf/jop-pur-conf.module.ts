import { Module } from '@nestjs/common';
import { JopPurConfService } from './jop-pur-conf.service';
import { JopPurConfController } from './jop-pur-conf.controller';

@Module({
  controllers: [JopPurConfController],
  providers: [JopPurConfService],
})
export class JopPurConfModule {}
