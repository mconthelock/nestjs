import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADJREASONMST } from 'src/common/Entities/webform/table/ADJREASONMST.entity';
import { ADJORDREQ } from 'src/common/Entities/webform/table/ADJORDREQ.entity';
import { ADJODRATTFILE } from 'src/common/Entities/webform/table/ADJODRATTFILE.entity';
import { PsAdjRepository } from './ps-adj.repository';
import { PsAdjService } from './ps-adj.service';
import { PsAdjController } from './ps-adj.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [ADJREASONMST, ADJORDREQ, ADJODRATTFILE],
            'webformConnection',
        ),
    ],
    controllers: [PsAdjController],
    providers: [PsAdjRepository, PsAdjService],
    exports: [PsAdjRepository, PsAdjService],
})
export class PsAdjModule {}
