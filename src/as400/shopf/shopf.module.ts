import { Module } from '@nestjs/common';
import { F002kpModule } from './f002kp/f002kp.module';

@Module({
    imports: [F002kpModule],
    exports: [F002kpModule],
})
export class ShopfModule {}