import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JigController } from './jig.controller';
import { JigService } from './jig.service';
import { JigRepository } from './jig.repository';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigInspection } from 'src/common/Entities/iedoc/table/jig_inspection.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [JigMaster, JigInspection],
            'iedocConnection',
        ),
    ],
    controllers: [JigController],
    providers: [JigService, JigRepository],
    exports: [JigService, JigRepository],
})
export class JigModule {}