import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WMSTempIssueEntity } from 'src/common/Entities/sdsys/table/WMS_TEMPISSUE.entity';
import { WMSController } from './wms.controller';
import { WMSService } from './wms.service';

/**
 * WMS Module
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2026-02-12
 */
@Module({
    imports: [ TypeOrmModule.forFeature([WMSTempIssueEntity], 'sdsysConnection') ],
    controllers: [WMSController],
    providers: [WMSService],
})
export class WMSModule {}
