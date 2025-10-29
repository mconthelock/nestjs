import { Module } from '@nestjs/common';
import { MatrixItemMasterService } from './matrix-item-master.service';
import { MatrixItemMasterController } from './matrix-item-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatrixItemMaster } from './entities/matrix-item-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatrixItemMaster], 'idsConnection')],
  controllers: [MatrixItemMasterController],
  providers: [MatrixItemMasterService],
  exports: [MatrixItemMasterService],
})
export class MatrixItemMasterModule {}
