import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { k089kpController } from './k089kp.controller';
import { k089kpService } from './k089kp.service';

@Module({
    imports: [ConectionModule],
    controllers: [k089kpController],
    providers: [k089kpService],
    exports: [k089kpService],
})
export class k089kpModule {}
