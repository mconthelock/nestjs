import { Module } from '@nestjs/common';
import { IimService } from './iim.service';
import { IimRepository } from './iim.repository';

@Module({
    providers: [IimService, IimRepository],
    exports: [IimService],
})
export class IimModule {}
