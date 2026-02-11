import { Module } from '@nestjs/common';
import { BlockMasterService } from './block-master.service';
import { BlockMasterController } from './block-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockMaster } from 'src/common/Entities/escs/table/BLOCK_MASTER.entity';
import { BlockMasterRepository } from './block-master.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlockMaster], 'escsConnection')],
  controllers: [BlockMasterController],
  providers: [BlockMasterService, BlockMasterRepository],
  exports: [BlockMasterService],
})
export class BlockMasterModule {}
