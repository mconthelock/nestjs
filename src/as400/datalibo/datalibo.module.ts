import { Module } from '@nestjs/common';
import { R027Mp1Module } from './r027mp1/r027mp1.module';
@Module({
    imports: [R027Mp1Module],
})
export class DataliboModule {}
