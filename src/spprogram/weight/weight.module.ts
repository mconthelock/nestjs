import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightService } from './weight.service';
import { Weight } from './entities/weight.entity';
import { WeightController } from './weight.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Weight], 'mitsuConnection')],
    controllers: [WeightController],
    providers: [WeightService],
})
export class WeightModule {}
