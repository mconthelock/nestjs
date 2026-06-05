import { Module } from '@nestjs/common';
import { DpmsPackingListMainService } from './dpms_packing_list_main.service';
import { DpmsPackingListMainController } from './dpms_packing_list_main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST_MAIN } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST_MAIN.entity';
import { DpmsPackingListMainRepository } from './dpms_packing_list_main.repository';
import { S001kpModule } from 'src/as400/rtnlibf/s001kp/s001kp.module';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [DPMS_PACKING_LIST_MAIN],
            'workloadConnection',
        ),
        S001kpModule,
    ],
    controllers: [DpmsPackingListMainController],
    providers: [DpmsPackingListMainService, DpmsPackingListMainRepository],
    exports: [DpmsPackingListMainService],
})
export class DpmsPackingListMainModule {}
