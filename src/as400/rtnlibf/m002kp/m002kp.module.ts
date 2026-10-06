import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { M002kpController } from './m002kp.controller';
import { M002kpService } from './m002kp.service';

@Module({
    imports: [ConectionModule],
    controllers: [M002kpController],
    providers: [M002kpService],
    exports: [M002kpService],
})
export class M002kpModule {}
