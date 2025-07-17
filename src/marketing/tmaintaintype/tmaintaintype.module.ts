import { Module } from '@nestjs/common';
import { TmaintaintypeService } from './tmaintaintype.service';
import { TmaintaintypeController } from './tmaintaintype.controller';

@Module({
  controllers: [TmaintaintypeController],
  providers: [TmaintaintypeService],
})
export class TmaintaintypeModule {}
