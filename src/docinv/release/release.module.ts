import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseService } from './release.service';
import { ReleaseController } from './release.controller';

import { Release } from './entities/release.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Release], 'docinvConnection')],
  controllers: [ReleaseController],
  providers: [ReleaseService],
})
export class ReleaseModule {}
