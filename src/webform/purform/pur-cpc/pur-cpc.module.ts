import { forwardRef, Module } from '@nestjs/common';
import { PurCpcService } from './services/purcpc_form.service';
import { PurCpcController } from './pur-cpc.controller';
import { PurCpcRepository } from './repository/purcpc_form.repository';
import { IimModule as Iim400Module } from 'src/as400/bpcsfvnew/iim/iim.module';
import { CondComparisonPriceService } from './services/cond_comparison_price.service';
import { CondComparisonPriceRepository } from './repository/cond_comparison_price.repository';
import { PurcpcProcPlanViewRepository } from './repository/purcpc_proc_list_view.repository';
import { PurcpcProcCompareViewRepository } from './repository/purcpc_proc_compare_view.repository';
import { PurCpcDetailRepository } from './repository/purcpc_details.repository';
import { CreatePurCpcService } from './services/purcpc_create.service';
import { PurcpcProcItemDetailRepository } from './repository/purcpc_proc_item_detail.repository';
import { PurPraModule } from '../pur-pra/pur-pra.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COND_COMPARISON_PRICE } from 'src/common/Entities/webform/table/COND_COMPARISON_PRICE.entity';
import { PURCPC_DETAILS } from 'src/common/Entities/webform/table/PURCPC_DETAILS.entity';
import { PURCPC_FORM } from 'src/common/Entities/webform/table/PURCPC_FORM.entity';
import { PURCPC_FORM_LISTS_VIEW } from 'src/common/Entities/webform/views/PURCPC_FORM_LISTS_VIEW.entity';
import { PURCPC_PROC_COMPARE_VIEW } from 'src/common/Entities/webform/views/PURCPC_PROC_COMPARE_VIEW.entity';
import { PURCPC_PROC_ITEMDETAIL } from 'src/common/Entities/webform/views/PURCPC_PROC_ITEMDETAIL.entity';
import { PURCPC_PROC_LIST_VIEW } from 'src/common/Entities/webform/views/PURCPC_PROC_LIST_VIEW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        COND_COMPARISON_PRICE,
        PURCPC_DETAILS,
        PURCPC_FORM,
        PURCPC_FORM_LISTS_VIEW,
        PURCPC_PROC_COMPARE_VIEW,
        PURCPC_PROC_ITEMDETAIL,
        PURCPC_PROC_LIST_VIEW,
    ], 'mitsuConnection'),Iim400Module, forwardRef(() => PurPraModule)],
    controllers: [PurCpcController],
    providers: [
        // service
        PurCpcService,
        CreatePurCpcService,
        CondComparisonPriceService,
        // Repository
        PurCpcRepository,
        PurCpcDetailRepository,
        CondComparisonPriceRepository,
        PurcpcProcPlanViewRepository,
        PurcpcProcCompareViewRepository,
        PurcpcProcItemDetailRepository,
    ],
    exports: [CreatePurCpcService, PurCpcService],
})
export class PurCpcModule {}
