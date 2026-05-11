import { Module } from '@nestjs/common';
import { MarFileModule } from './mar-file/mar-file.module';

@Module({
    imports: [MarFileModule],
})
export class MarFormModule {}
