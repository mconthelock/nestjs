import { Module } from '@nestjs/common';
import { PtermcodeService } from './ptermcode.service';
import { PtermcodeController } from './ptermcode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PTERMCODE } from 'src/common/Entities/amec/table/PTERMCODE.entity';
import { PtermcodeRepository } from './ptermcode.repository';

@Module({
 imports: [TypeOrmModule.forFeature([PTERMCODE], 'webformConnection')],
    controllers: [PtermcodeController],
    providers: [PtermcodeService, PtermcodeRepository],
    exports: [PtermcodeService],
})
export class PtermcodeModule {}
