import { Module } from '@nestjs/common';
import { FinpckVwstatusService } from './finpck-vwstatus.service';
import { FinpckVwstatusController } from './finpck-vwstatus.controller';
import { VWStatusRepository } from './finpck-vwstatus.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FINPCK_VWSTATUS } from 'src/common/Entities/webform/views/FINPCK_VWSTATUS.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FINPCK_VWSTATUS,
    ], 'mitsuConnection'),
    ],
    controllers: [FinpckVwstatusController],
    providers: [FinpckVwstatusService, VWStatusRepository],
})
export class FinpckVwstatusModule {}
