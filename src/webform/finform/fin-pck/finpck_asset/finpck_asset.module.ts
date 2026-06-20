import { Module } from '@nestjs/common';
import { FinpckAssetService } from './finpck_asset.service';
import { FinpckAssetController } from './finpck_asset.controller';

@Module({
  controllers: [FinpckAssetController],
  providers: [FinpckAssetService],
})
export class FinpckAssetModule {}
