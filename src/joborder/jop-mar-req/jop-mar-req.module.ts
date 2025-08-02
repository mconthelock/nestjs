import { Module } from '@nestjs/common';
import { JopMarReqService } from './jop-mar-req.service';
import { JopMarReqController } from './jop-mar-req.controller';

@Module({
  controllers: [JopMarReqController],
  providers: [JopMarReqService],
})
export class JopMarReqModule {}
