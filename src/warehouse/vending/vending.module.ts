import { Module } from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendingController } from './vending.controller';
import { VendingRepository } from './vending.repository';
import { FormModule } from 'src/webform/form/form.module';
import { StocksModule } from 'src/pursys/stocks/stocks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VENDING_USER } from 'src/common/Entities/skid/table/VENDING_USER.entity';
import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';
import { StockBalances } from 'src/common/Entities/pursys/table/STOCK_BALANCES.entity';
import { TOOL_IMPORT_HISTORY } from 'src/common/Entities/skid/table/TOOL_IMPORT_HISTORY.entity';
import { TOOL_WITHDRAWAL } from 'src/common/Entities/skid/table/TOOL_WITHDRAWAL.entity';
import { TOOL_REFILL } from 'src/common/Entities/skid/table/TOOL_REFILL.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { Categories } from '../../common/Entities/pursys/table/CATEGORIES.entity';
import { ORGPOS } from '../../common/Entities/webform/table/ORGPOS.entity';
import { QAINS_FORM } from '../../common/Entities/webform/table/QAINS_FORM.entity';
import { QAINS_OPERATOR_AUDITOR } from '../../common/Entities/webform/table/QAINS_OPERATOR_AUDITOR.entity';
import { USERS } from '../../common/Entities/escs/table/USERS.entity';
import { INV_YEARLY_ASSIGN } from '../../common/Entities/skid/table/INV_YEARLY_ASSIGN.entity';

@Module({
    controllers: [VendingController],
    providers: [VendingService, VendingRepository],
    imports: [
        TypeOrmModule.forFeature([
        VENDING_USER,
        Products,
        StockBalances,
        TOOL_IMPORT_HISTORY,
        TOOL_WITHDRAWAL,
        TOOL_REFILL,
        AMECUSERALL,
        Categories,
        ORGPOS,
        QAINS_FORM,
        QAINS_OPERATOR_AUDITOR,
        USERS,
        INV_YEARLY_ASSIGN,
    ], 'mitsuConnection'),FormModule, StocksModule],
})
export class VendingModule {}
