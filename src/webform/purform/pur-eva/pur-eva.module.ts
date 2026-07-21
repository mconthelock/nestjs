import { Module } from '@nestjs/common';
import { PurEvaService } from './pur-eva.service';
import { PurEvaController } from './pur-eva.controller';
import { PurevaFormModule } from './pureva_form/pureva_form.module';
import { PurevaScoreModule } from './pureva_score/pureva_score.module';
import { PurevaProfitTurnoverModule } from './pureva_profit_turnover/pureva_profit_turnover.module';
import { PurevaVendorRelationModule } from './pureva_vendor_relation/pureva_vendor_relation.module';

@Module({
  controllers: [PurEvaController],
  providers: [PurEvaService],
  imports: [PurevaFormModule, PurevaScoreModule, PurevaProfitTurnoverModule, PurevaVendorRelationModule],
})
export class PurEvaModule {}
