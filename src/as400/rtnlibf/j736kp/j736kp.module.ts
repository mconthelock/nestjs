import { Module } from '@nestjs/common';
import { J736kpService } from './j736kp.service';
import { J736kpController } from './j736kp.controller';
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [J736kpController],
    providers: [J736kpService, ConectionService],
    exports: [J736kpService],
})
export class J736kpModule {}
