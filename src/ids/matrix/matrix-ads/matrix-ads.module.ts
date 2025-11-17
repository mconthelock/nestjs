import { Module } from '@nestjs/common';
import { MatrixAdsService } from './matrix-ads.service';
import { MatrixAdsController } from './matrix-ads.controller';

@Module({
  controllers: [MatrixAdsController],
  providers: [MatrixAdsService],
})
export class MatrixAdsModule {}
