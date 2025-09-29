import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightService } from './weight.service';
import { Weight } from './entities/weight.entity';
import { WeightController } from './weight.controller';

@Module({
  controllers: [WeightController],
  imports: [
    TypeOrmModule.forFeature([Weight], 'amecConnection')
  ],
  providers: [WeightService],
})
export class WeightModule {}
