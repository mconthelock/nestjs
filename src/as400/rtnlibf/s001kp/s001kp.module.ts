import { Module } from '@nestjs/common';
import { S001kpService } from './s001kp.service';
import { S001kpController } from './s001kp.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
    imports: [ConectionModule],
    controllers: [S001kpController],
    providers: [S001kpService],
    exports: [S001kpService],
})
export class S001kpModule {}
