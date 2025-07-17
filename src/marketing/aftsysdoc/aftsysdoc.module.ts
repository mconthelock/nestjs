import { Module } from '@nestjs/common';
import { AftsysdocService } from './aftsysdoc.service';
import { AftsysdocController } from './aftsysdoc.controller';

@Module({
  controllers: [AftsysdocController],
  providers: [AftsysdocService],
})
export class AftsysdocModule {}
