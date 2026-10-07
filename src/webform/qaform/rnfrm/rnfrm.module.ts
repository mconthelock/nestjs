import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNFRM } from 'src/common/Entities/webform/table/RNFRM.entity';

import { RnfrmController } from './rnfrm.controller';
import { RnfrmRepository } from './rnfrm.repository';
import { RnfrmService } from './rnfrm.service';

@Module({
    imports: [TypeOrmModule.forFeature([RNFRM], 'webformConnection')],
    controllers: [RnfrmController],
    providers: [RnfrmService, RnfrmRepository],
    exports: [RnfrmService],
})
export class RnfrmModule {}