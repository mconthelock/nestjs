import { Module } from '@nestjs/common';
import { BlockMasterService } from './block-master.service';
import { BlockMasterController } from './block-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BLOCK_MASTER } from 'src/common/Entities/escs/table/BLOCK_MASTER.entity';
import { BlockMasterRepository } from './block-master.repository';
import { ItemMfgModule } from '../item-mfg/item-mfg.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BLOCK_MASTER], 'escsConnection'),
    ItemMfgModule,
  ],
  controllers: [BlockMasterController],
  providers: [BlockMasterService, BlockMasterRepository],
  exports: [BlockMasterService],
})
export class BlockMasterModule {}
