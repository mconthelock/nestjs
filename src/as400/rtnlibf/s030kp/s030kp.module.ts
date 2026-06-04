import { Module } from '@nestjs/common';
import { S030kpService } from './s030kp.service';
import { S030kpController } from './s030kp.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
    imports: [ConectionModule],
    controllers: [S030kpController],
    providers: [S030kpService],
    exports: [S030kpService],
})
export class S030kpModule {}
