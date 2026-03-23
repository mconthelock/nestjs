import { Module } from '@nestjs/common';
import { F002kpService } from './f002kp.service';
import { F002kpController } from './f002kp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F002KP } from 'src/common/Entities/datacenter/table/F002KP.entity';
import { F002kpRepository } from './f002kp.repository';

@Module({
    imports: [TypeOrmModule.forFeature([F002KP], 'datacenterConnection')],
    controllers: [F002kpController],
    providers: [F002kpService, F002kpRepository],
    exports: [F002kpService],
})
export class F002kpModule {}
