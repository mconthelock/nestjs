import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WMSController } from './wms.controller';
import { WMSService } from './wms.service';

/**
 * WMS Module
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2026-02-12
 */
@Module({
    controllers: [WMSController],
    providers: [WMSService],
})
export class WMSModule {}
