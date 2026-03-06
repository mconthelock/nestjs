import { Module } from '@nestjs/common';
import { MfgSerialService } from './mfg-serial.service';
import { MfgSerialController } from './mfg-serial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MFG_SERIAL } from 'src/common/Entities/escs/table/MFG_SERIAL.entity';
import { MfgSerialRepository } from './mfg-serial.repository';

@Module({
    imports: [TypeOrmModule.forFeature([MFG_SERIAL], 'escsConnection')],
    controllers: [MfgSerialController],
    providers: [MfgSerialService, MfgSerialRepository],
    exports: [MfgSerialService],
})
export class MfgSerialModule {}
