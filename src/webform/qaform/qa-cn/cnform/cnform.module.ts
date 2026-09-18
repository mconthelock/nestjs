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
<<<<<<< HEAD
    exports: [CnformService, CnFormRepository],
=======
    exports: [CnformService],
>>>>>>> 67c79348 (PUR-EVA)
})
export class CnformModule {}
