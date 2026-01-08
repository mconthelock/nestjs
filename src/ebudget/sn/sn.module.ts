import { Module } from '@nestjs/common';
import { SnService } from './sn.service';
import { SnController } from './sn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBUDGET_DATA_SN } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_SN.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EBUDGET_DATA_SN], 'ebudgetConnection')],
  controllers: [SnController],
  providers: [SnService],
  exports: [SnService],
})
export class SnModule {}
