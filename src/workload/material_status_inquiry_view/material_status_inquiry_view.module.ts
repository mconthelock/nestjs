import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialStatusInquiryViewService } from './material_status_inquiry_view.service';
import { MaterialStatusInquiryViewController } from './material_status_inquiry_view.controller';
import { MATERIAL_STATUS_INQUIRY_VIEW } from 'src/common/Entities/workload/views/MATERIAL_STATUS_INQUIRY_VIEW.entity';
import { MaterialStatusInquiryViewRepository } from './material_status_inquiry_view.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [MATERIAL_STATUS_INQUIRY_VIEW],
            'workloadConnection',
        ),
    ],
    controllers: [MaterialStatusInquiryViewController],
    providers: [
        MaterialStatusInquiryViewService,
        MaterialStatusInquiryViewRepository,
    ],
})
export class MaterialStatusInquiryViewModule {}
