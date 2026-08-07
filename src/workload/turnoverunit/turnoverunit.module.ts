import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TurnoverunitService } from './turnoverunit.service';
import { TurnoverunitController } from './turnoverunit.controller';

import { Turnoverunit } from 'src/common/Entities/workload/table/TURNOVER_UNIT.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Turnoverunit], 'workloadConnection')],
    controllers: [TurnoverunitController],
    providers: [TurnoverunitService],
})
export class TurnoverunitModule {}
