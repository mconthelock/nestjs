import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_ATT } from 'src/common/Entities/workload/table/PILINE_ATT.entity';
import { PilineAttController } from './PILINE_ATT.controller';
import { PilineAttService } from './PILINE_ATT.service';
import { PilineAttRepository } from './PILINE_ATT.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PILINE_ATT], 'workloadConnection')],
    controllers: [PilineAttController],
    providers: [PilineAttService, PilineAttRepository],
    exports: [PilineAttService],
})
export class PilineAttModule {}
