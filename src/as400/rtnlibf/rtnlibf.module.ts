import { Module } from '@nestjs/common';
import { k089kpModule } from './k089kp/k089kp.module';

@Module({
    imports: [k089kpModule],
})
export class rtnlibfModule {}
