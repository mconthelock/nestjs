import { Module } from '@nestjs/common';
import { CnformService } from './cnform.service';
import { CnformController } from './cnform.controller';
import { CNFORM } from 'src/common/Entities/webform/table/CNFORM.entity';
import { CnFormRepository } from './cnform.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CNFORM], 'webformConnection')],
    controllers: [CnformController],
    providers: [CnformService, CnFormRepository],
    exports: [CnformService],
})
export class CnformModule {}
