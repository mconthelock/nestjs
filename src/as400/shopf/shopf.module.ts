import { Module } from '@nestjs/common';
import { F001kpModule } from './f001kp/f001kp.module';
import { F002kpModule } from './f002kp/f002kp.module';
import { F003kpModule } from './f003kp/f003kp.module';

@Module({
    imports: [F001kpModule, F002kpModule, F003kpModule],
})
export class ShopfModule {}
