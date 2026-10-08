import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { MachineRepository } from './machine.repository';

@Module({
    controllers: [MachineController],
    providers: [MachineService, MachineRepository],
    exports: [MachineService]
})
export class MachineModule {}