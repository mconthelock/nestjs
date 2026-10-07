import { Module } from '@nestjs/common';
import { PurevaScoreService } from './pureva_score.service';
import { PUREVA_SCORE } from 'src/common/Entities/webform/table/PUREVA_SCORE.entity';
import { PurevaScoreController } from './pureva_score.controller';
import { PurevaScoreRepository } from './pureva_score.repository';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
   imports: [TypeOrmModule.forFeature([PUREVA_SCORE], 'webformConnection')],
  controllers: [PurevaScoreController],
  providers: [PurevaScoreService , PurevaScoreRepository],
  exports:[PurevaScoreService]
})
export class PurevaScoreModule {}


