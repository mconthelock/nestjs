import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { PSDLC_DETAIL } from 'src/common/Entities/webform/table/PSDLC_DETAIL.entity';
import { PSDLC_FORM } from 'src/common/Entities/webform/table/PSDLC_FORM.entity';
import { FlowModule } from 'src/webform/flow/flow.module';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { PSDLCController } from './ps-dlc.controller';
import { PSDLCService } from './ps-dlc.service';
import { PSDLCRepository } from './ps-dlc.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PSDLC_FORM, PSDLC_DETAIL],
            'webformConnection',
        ),
        FormmstModule,
        FormModule,
        FlowModule,
        ConectionModule,
    ],
    controllers: [PSDLCController],
    providers: [PSDLCService, PSDLCRepository],
    exports: [PSDLCService],
})
export class PSDLCModule {}
