import { Module } from '@nestjs/common';
import { IimService } from './iim.service';
import { IimRepository } from './iim.repository';
import { IimController } from './iim.controller';

@Module({
    controllers: [IimController],
    providers: [IimService, IimRepository],
    exports: [IimService],
})
export class IimModule {}
