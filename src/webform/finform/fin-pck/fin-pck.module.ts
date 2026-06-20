import { Module } from '@nestjs/common';
import { FinPckService } from './fin-pck.service';
import { FinPckController } from './fin-pck.controller';
import { FinpckAssetModule } from './finpck_asset/finpck_asset.module';
import { FinpckFormModule } from './finpck_form/finpck_form.module';

@Module({
  controllers: [FinPckController],
  providers: [FinPckService],
  imports: [FinpckAssetModule, FinpckFormModule],
})
export class FinPckModule {}
