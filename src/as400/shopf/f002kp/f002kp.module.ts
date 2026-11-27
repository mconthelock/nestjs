import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { F002kpService } from './f002kp.service';

@Module({
    imports: [
        ConectionModule,
    ],
    providers: [
        F002kpService,
    ],
    exports: [
        F002kpService,
    ],
})
export class F002kpModule {}