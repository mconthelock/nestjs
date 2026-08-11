import { Module } from '@nestjs/common';
import { PcurrencyService } from './pcurrency.service';
import { PcurrencyController } from './pcurrency.controller';
import { PcurrencyRepository } from './pcurrency.repository';
import { PCURRENCY } from 'src/common/Entities/amec/table/PCURRENCY.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PCURRENCY], 'webformConnection')],
  controllers: [PcurrencyController],
  providers: [PcurrencyService, PcurrencyRepository],
  exports: [PcurrencyService],
})
export class PcurrencyModule {}
