import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatioService } from './ratio.service';
import { RatioController } from './ratio.controller';
import { Ratio } from './entities/ratio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ratio], 'amecConnection')],
  controllers: [RatioController],
  providers: [RatioService],
})
export class RatioModule {}
