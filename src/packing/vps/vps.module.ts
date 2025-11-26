import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VPSService } from './vps.service';
import { VPSController } from './vps.controller';
import { PAccessLog } from '../auth/entities/p-access-log.entity';

/**
 * VPS Module
 * Handles VIS/PIS check and packing operations
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2025-11-25
 */
@Module({
  imports: [TypeOrmModule.forFeature([PAccessLog], 'packingConnection')],
  controllers: [VPSController],
  providers: [VPSService],
})
export class VPSModule {}
