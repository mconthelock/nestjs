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
<<<<<<< HEAD
    exports: [AttcnfrmService, AttCnFrmRepository],
=======
    exports: [AttcnfrmService],
>>>>>>> 67c79348 (PUR-EVA)
})
export class AttcnfrmModule {}
