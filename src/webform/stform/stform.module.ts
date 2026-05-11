import { Module } from '@nestjs/common';
import { StInpModule } from './st-inp/st-inp.module';

@Module({
    imports: [StInpModule],
})
export class STFormModule {}
