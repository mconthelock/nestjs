import { Module } from '@nestjs/common';
import { ReturnApvListService } from './return-apv-list.service';
import { ReturnApvListController } from './return-apv-list.controller';
import { ReturnApvListRepository } from './return-apv-list.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RETURN_APV_LIST } from 'src/common/Entities/escs/table/RETURN_APV_LIST.entity';
import { OrdersDrawingModule } from '../orders-drawing/orders-drawing.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { GetOrderModule } from '../get-order/get-order.module';
import { SequenceOrgModule } from 'src/webform/center/sequence-org/sequence-org.module';
import { UsersSectionModule } from '../user_section/user_section.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RETURN_APV_LIST], 'escsConnection'),
        OrdersDrawingModule,
        MailModule,
        GetOrderModule,
        SequenceOrgModule,
        UsersSectionModule,
    ],
    controllers: [ReturnApvListController],
    providers: [ReturnApvListService, ReturnApvListRepository],
    exports: [ReturnApvListService],
})
export class ReturnApvListModule {}
