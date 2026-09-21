import { Module } from '@nestjs/common';
import { HpoService } from './hpo.service';
import { HpoController } from './hpo.controller';

@Module({
  controllers: [HpoController],
  providers: [HpoService],
})
export class HpoModule {}
