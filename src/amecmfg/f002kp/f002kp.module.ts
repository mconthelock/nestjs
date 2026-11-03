import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F002kpService } from './f002kp.service';
import { F002kpController } from './f002kp.controller';
import { F002KP } from './entities/f002kp.entity';

@Module({
    imports: [TypeOrmModule.forFeature([F002KP], 'datacenterConnection')],
    controllers: [F002kpController],
    providers: [F002kpService],
})
export class F002kpModule {}
