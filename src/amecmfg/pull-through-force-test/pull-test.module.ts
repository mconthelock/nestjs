import { Module } from '@nestjs/common';
import { MachineRepository } from 'src/escs/machine/machine.repository';
import { PullTestController } from './pull-test.controller';
import { PullTestService } from './pull-test.service';

@Module({
    controllers: [PullTestController],
    providers: [PullTestService, MachineRepository],
})
export class PullTestModule {}