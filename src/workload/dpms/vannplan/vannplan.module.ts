import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VannplanService } from './vannplan.service';
import { VannplanController } from './vannplan.controller';

import { Vannplan } from 'src/common/Entities/workload/views/VANNPLAN.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vannplan], 'workloadConnection')],
    controllers: [VannplanController],
    providers: [VannplanService],
    exports: [VannplanService],
})
export class VannplanModule {}
