import { Module } from '@nestjs/common';
import { GpTphService } from './gp-tph.service';
import { GpTphController } from './gp-tph.controller';
import { GPTPH_LOCATION } from 'src/common/Entities/webform/table/GPTPH_LOCATION.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GPTPH_AREAS } from 'src/common/Entities/webform/table/GPTPH_AREAS.entity';
import { GpTphRepository } from './gp-tph.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [GPTPH_AREAS,GPTPH_LOCATION],
      'webformConnection',),
  ],
  controllers: [GpTphController],
  providers: [GpTphService, GpTphRepository],
  exports: [GpTphService],
})
export class GpTphModule {}
