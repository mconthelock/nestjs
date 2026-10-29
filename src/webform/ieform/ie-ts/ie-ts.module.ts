import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROC_TSHEADFORM } from 'src/common/Entities/webform/table/PROC_TSHEADFORM.entity';
import { PROC_TSDETFORM } from 'src/common/Entities/webform/table/PROC_TSDETFORM.entity';
import { PROC_TSATTFILE } from 'src/common/Entities/webform/table/PROC_TSATTFILE.entity';
import { FormModule } from 'src/webform/form/form.module';
import { IeTsController } from './ie-ts.controller';
import { IeTsRepository } from './ie-ts.repository';
import { IeTsService } from './ie-ts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PROC_TSHEADFORM, PROC_TSDETFORM, PROC_TSATTFILE],
            'webformConnection',
        ),
        FormModule,
    ],
    controllers: [IeTsController],
    providers: [IeTsRepository, IeTsService],
    exports: [IeTsService, IeTsRepository],
})
export class IeTsModule {}
