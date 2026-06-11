import { Module } from '@nestjs/common';
import { AmecordersScheduleService } from './amecorders_schedule.service';
import { AmecordersScheduleController } from './amecorders_schedule.controller';
import { AmecordersScheduleRepository } from './amecorders_schedule.repository';
import { AmecOrdersSchedule } from 'src/common/Entities/workload/table/amecorders_schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([AmecOrdersSchedule], 'workloadConnection'),
    ],
    controllers: [AmecordersScheduleController],
    providers: [AmecordersScheduleService, AmecordersScheduleRepository],
    exports: [AmecordersScheduleService],
})
export class AmecordersScheduleModule {}
