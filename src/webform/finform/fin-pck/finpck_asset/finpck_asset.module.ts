import { Module } from '@nestjs/common';
import { FinpckAssetService } from './finpck_asset.service';
import { FinpckAssetRepository } from './finpck_asset.repository';
import { FinpckAssetController } from './finpck_asset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FINPCK_ASSET } from 'src/common/Entities/webform/table/FINPCK_ASSET.entity';
import { FINPCK_FORM } from '../../../../common/Entities/webform/table/FINPCK_FORM.entity';
import { FXA_GRPMST } from '../../../../common/Entities/webform/table/FXA_GRMST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FINPCK_ASSET,
        FINPCK_FORM,
        FXA_GRPMST,
    ], 'mitsuConnection'),],
    controllers: [FinpckAssetController],
    providers: [FinpckAssetService, FinpckAssetRepository],
    exports: [FinpckAssetService, FinpckAssetRepository],
})
export class FinpckAssetModule {}
