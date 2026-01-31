import { Module } from '@nestjs/common';
import { EbgreqcaseService } from './ebgreqcase.service';
import { EbgreqcaseController } from './ebgreqcase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBGREQCASE } from 'src/common/Entities/ebudget/table/EBGREQCASE.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EBGREQCASE], 'ebudgetConnection')],
  controllers: [EbgreqcaseController],
  providers: [EbgreqcaseService],
  exports: [EbgreqcaseService],
})
export class EbgreqcaseModule {}
