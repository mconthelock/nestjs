import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WMSController } from './wms.controller';
import { WMSService } from './wms.service';
import { WMSRepository } from './wms.repository';
import { WMS_TEMPISSUE } from 'src/common/Entities/sdsys/views/WMS_TEMPISSUE.entity';

/**
 * WMS Module
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2026-02-12
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([
            WMS_TEMPISSUE,
        ], 'mitsuConnection'),
    ],
    controllers: [WMSController],
    providers: [WMSService, WMSRepository],
})
export class WMSModule {}