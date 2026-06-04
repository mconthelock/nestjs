import { Module } from '@nestjs/common';
import { S026kpService } from './s026kp.service';
import { S026kpController } from './s026kp.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
    imports: [ConectionModule],
    controllers: [S026kpController],
    providers: [S026kpService],
    exports: [S026kpService],
})
export class S026kpModule {}
