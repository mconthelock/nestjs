import { Module } from '@nestjs/common';
import { IimModule } from './iim/iim.module';

@Module({
    imports: [IimModule],
})
export class BpcsfvnewModule {}
