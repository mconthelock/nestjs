import { Module } from '@nestjs/common';
import { GeneralPartListService } from './general-part-list.service';
import { GeneralPartListController } from './general-part-list.controller';
import { M12023ItemarrnglstAppModule } from 'src/elmes/m12023_itemarrnglst_app/m12023_itemarrnglst_app.module';
import { M001KpbmModule } from 'src/datacenter/m001-kpbm/m001-kpbm.module';
import { OrderdummyModule } from 'src/marketing/orderdummy/orderdummy.module';

@Module({
    imports: [M12023ItemarrnglstAppModule, M001KpbmModule, OrderdummyModule],
    controllers: [GeneralPartListController],
    providers: [GeneralPartListService],
    exports: [GeneralPartListService],
})
export class GeneralPartListModule {}
