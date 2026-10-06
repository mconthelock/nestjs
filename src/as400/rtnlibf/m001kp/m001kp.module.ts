import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { M001kpController } from './m001kp.controller';
import { M001kpService } from './m001kp.service';

@Module({
    imports: [ConectionModule],
    controllers: [M001kpController],
    providers: [M001kpService],
    exports: [M001kpService],
})
export class M001kpModule {}
