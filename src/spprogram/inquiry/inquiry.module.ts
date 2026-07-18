import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

import { Inquiry } from './entities/inquiry.entity';
import { Orderpart } from 'src/marketing/orderparts/entities/orderpart.entity';
import { Spcalsheet } from 'src/marketing/spcalsheet/entities/spcalsheet.entity';
import { User } from 'src/amec/users/entities/user.entity';
import { Partcategory } from 'src/spprogram/partcategory/entities/partcategory.entity';

import { InquiryGroupModule } from '../inquiry-group/inquiry-group.module';
import { InquiryDetailModule } from '../inquiry-detail/inquiry-detail.module';
import { HistoryModule } from '../history/history.module';
import { StatusModule } from '../status/status.module';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Inquiry, Orderpart, Spcalsheet, User, Partcategory],
            'spsysConnection',
        ),
        InquiryGroupModule,
        InquiryDetailModule,
        HistoryModule,
        StatusModule,
    ],
    controllers: [InquiryController],
    providers: [InquiryService],
    exports: [InquiryService],
})
export class InquiryModule {}
