import { Module } from '@nestjs/common';
import { FinpckAssetService } from './finpck_asset.service';
import { FinpckAssetRepository } from './finpck_asset.repository';
import { FinpckAssetController } from './finpck_asset.controller';

@Module({
  imports: [],
  controllers:[FinpckAssetController],
  providers: [FinpckAssetService, FinpckAssetRepository], 
  exports: [FinpckAssetService, FinpckAssetRepository]
})
export class FinpckAssetModule {}
