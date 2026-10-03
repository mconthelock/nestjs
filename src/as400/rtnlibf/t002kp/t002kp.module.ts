import { Module } from '@nestjs/common';
import { T002kpService } from './t002kp.service';
import { T002kpController } from './t002kp.controller';

@Module({
    controllers: [T002kpController],
    providers: [T002kpService],
    exports: [T002kpService],
})
export class T002kpModule {}
