import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigInspection } from 'src/common/Entities/iedoc/table/jig_inspection.entity';
import { JigController } from './jig.controller';
import { JigService } from './jig.service';
import { JigRepository } from './jig.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JigMaster,
            JigInspection,
        ]),
    ],
    controllers: [
        JigController,
    ],
    providers: [
        JigService,
        JigRepository,
    ],
    exports: [
        JigService,
    ],
})
export class JigModule {}