import { Module } from '@nestjs/common';
import { PprbiddingService } from './pprbidding.service';
import { PprbiddingController } from './pprbidding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPRBIDDING } from 'src/common/Entities/amec/table/PPRBIDDING.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PPRBIDDING], 'webformConnection')],
  controllers: [PprbiddingController],
  providers: [PprbiddingService],
  exports: [PprbiddingService],
})
export class PprbiddingModule {}
