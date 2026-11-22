import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURPO_FORM } from 'src/common/Entities/webform/table/PURPO_FORM.entity';
import { PURPO_SYNC_OUTBOX } from 'src/common/Entities/webform/table/PURPO_SYNC_OUTBOX.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { PurPoController } from './pur-po.controller';
import { PurPoService } from './pur-po.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PURPO_FORM, PURPO_SYNC_OUTBOX, FORM, FLOW, FORMMST],
            'mitsuConnection',
        ),
        FormModule,
        FlowModule,
        FormmstModule,
    ],
    controllers: [PurPoController],
    providers: [PurPoService],
    exports: [PurPoService],
})
export class PurPoModule {}
