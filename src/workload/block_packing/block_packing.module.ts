import { Module } from '@nestjs/common';
import { BlockPackingService } from './block_packing.service';
import { BlockPackingController } from './block_packing.controller';
import { BlockPackingRepository } from './block_packing.repository';

@Module({
  controllers: [BlockPackingController],
  providers: [BlockPackingService, BlockPackingRepository],
})
export class BlockPackingModule {}
