import { Module } from '@nestjs/common';
import { IimModule } from './iim/iim.module';
import { HpoModule } from './hpo/hpo.module';

@Module({
    imports: [IimModule, HpoModule],
})
export class BpcsfvnewModule {}
