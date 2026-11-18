import { Module } from '@nestjs/common';
import { CnformService } from './cnform.service';
import { CnformController } from './cnform.controller';
import { CNFORM } from 'src/common/Entities/webform/table/CNFORM.entity';
import { CNITMINCHARGE } from 'src/common/Entities/webform/table/CNITMINCHARGE.entity';
import { CnFormRepository } from './cnform.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CNFORM, CNITMINCHARGE], 'mitsuConnection')],
    controllers: [CnformController],
    providers: [CnformService, CnFormRepository],
    exports: [CnformService, CnFormRepository],
})
export class CnformModule {}
