import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROC_TSHEADFORM } from 'src/common/Entities/webform/table/PROC_TSHEADFORM.entity';
import { PROC_TSDETFORM } from 'src/common/Entities/webform/table/PROC_TSDETFORM.entity';
import { PROC_TSATTFILE } from 'src/common/Entities/webform/table/PROC_TSATTFILE.entity';
import { FormModule } from 'src/webform/form/form.module';
import { IePtsController } from './ie-pts.controller';
import { IePtsRepository } from './ie-pts.repository';
import { IePtsService } from './ie-pts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PROC_TSHEADFORM, PROC_TSDETFORM, PROC_TSATTFILE],
            'webformConnection',
        ),
        FormModule,
    ],
    controllers: [IePtsController],
    providers: [IePtsRepository, IePtsService],
    exports: [IePtsService, IePtsRepository],
})
export class IePtsModule {}
