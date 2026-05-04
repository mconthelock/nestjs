import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { MachineRepository } from './machine.repository';
import { MACHINE_NAME } from 'src/common/Entities/escs/table/MACHINE_NAME.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MACHINE_NAME],'escsConnection')
    ],
    controllers: [MachineController],
    providers: [MachineService, MachineRepository],
    exports: [MachineService]
})
export class MachineModule {}