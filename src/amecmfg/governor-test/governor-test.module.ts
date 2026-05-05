import { Module } from '@nestjs/common';
import { GovernorTestController } from './governor-test.controller';
import { GovernorTestService } from './governor-test.service';
import { MachineRepository } from 'src/escs/machine/machine.repository';

@Module({
    controllers: [GovernorTestController],
    providers: [GovernorTestService, MachineRepository]
})
export class GovernorTestModule {}