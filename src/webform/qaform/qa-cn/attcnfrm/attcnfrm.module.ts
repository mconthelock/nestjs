import { Module } from '@nestjs/common';
import { AttcnfrmService } from './attcnfrm.service';
import { AttcnfrmController } from './attcnfrm.controller';
import { AttCnFrmRepository } from './attcnfrm.repository';
import { ATTCNFRM } from 'src/common/Entities/webform/table/ATTCNFRM.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ATTCNFRM], 'webformConnection')],
    controllers: [AttcnfrmController],
    providers: [AttcnfrmService, AttCnFrmRepository],
    exports: [AttcnfrmService],
})
export class AttcnfrmModule {}
