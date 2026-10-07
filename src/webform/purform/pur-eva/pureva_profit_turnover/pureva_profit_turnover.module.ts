import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurevaProfitTurnoverService } from './pureva_profit_turnover.service';
import { PurevaProfitTurnoverController } from './pureva_profit_turnover.controller';
import { PUREVA_PROFIT_TURNOVER } from 'src/common/Entities/webform/table/PUREVA_PROFIT_TURNOVER.entity';
import { PurevaProfitTurnoverRepository } from './pureva_profit_turnover.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PUREVA_PROFIT_TURNOVER], 'webformConnection')],
  controllers: [PurevaProfitTurnoverController],
  providers: [PurevaProfitTurnoverService, PurevaProfitTurnoverRepository],
  exports:[PurevaProfitTurnoverService]
})
export class PurevaProfitTurnoverModule {}
