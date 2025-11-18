import { Module } from '@nestjs/common';
import { MatrixAdsService } from './matrix-ads.service';
import { MatrixAdsController } from './matrix-ads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatrixAd } from './entities/matrix-ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatrixAd], 'idsConnection')],
  controllers: [MatrixAdsController],
  providers: [MatrixAdsService],
  exports: [MatrixAdsService],
})
export class MatrixAdsModule {}
