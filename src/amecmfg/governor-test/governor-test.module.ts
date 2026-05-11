import { Module } from '@nestjs/common';
import { MachineRepository } from 'src/escs/machine/machine.repository';
import { GovernorTestController } from './governor-test.controller';
import { GovernorTestService } from './governor-test.service';

@Module({
    controllers: [GovernorTestController],
    providers: [GovernorTestService, MachineRepository]
})
export class GovernorTestModule {}