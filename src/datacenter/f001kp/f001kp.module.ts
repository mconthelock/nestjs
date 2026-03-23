import { Module } from '@nestjs/common';
import { F001kpService } from './f001kp.service';
import { F001kpController } from './f001kp.controller';
import { F001KP } from 'src/common/Entities/datacenter/table/F001KP.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F001kpRepository } from './f001kp.repository';

@Module({
    imports: [TypeOrmModule.forFeature([F001KP], 'datacenterConnection')],
    controllers: [F001kpController],
    providers: [F001kpService, F001kpRepository],
    exports: [F001kpService],
})
export class F001kpModule {}
