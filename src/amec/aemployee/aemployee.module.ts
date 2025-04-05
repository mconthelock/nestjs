import { Module } from '@nestjs/common';
import { AemployeeService } from './aemployee.service';
import { AemployeeController } from './aemployee.controller';

@Module({
  controllers: [AemployeeController],
  providers: [AemployeeService],
})
export class AemployeeModule {}
