import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FEOT_DETAILS } from 'src/common/Entities/webform/table/FEOT_DETAILS.entity';
import { FEOTController } from './fe-ot.controller';
import { FEOTService } from './fe-ot.service';
import { FEOTRepository } from './fe-ot.repository';
import { FEOT_REQUESTS } from 'src/common/Entities/webform/table/FEOT_REQUESTS.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [FEOT_DETAILS],
            'webformConnection',
        ),
    ],
    controllers: [FEOTController],
    providers: [FEOTService, FEOTRepository],
    exports: [FEOTService],
})
export class FEOTModule {}
