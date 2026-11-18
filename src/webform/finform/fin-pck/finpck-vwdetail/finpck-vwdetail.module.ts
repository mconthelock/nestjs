import { Module } from '@nestjs/common';
import { FinpckVwdetailService } from './finpck-vwdetail.service';
import { FinpckVwdetailController } from './finpck-vwdetail.controller';
import { VWDetailRepository } from './finpck-vwdetail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FINPCK_VWDETAIL } from 'src/common/Entities/webform/views/FINPCK_VWDETAIL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FINPCK_VWDETAIL,
    ], 'mitsuConnection'),
    ],
    controllers: [FinpckVwdetailController],
    providers: [FinpckVwdetailService, VWDetailRepository],
})
export class FinpckVwdetailModule {}
