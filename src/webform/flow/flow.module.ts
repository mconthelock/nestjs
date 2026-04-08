import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { RepModule } from '../rep/rep.module';
import { FormModule } from '../form/form.module';
import { UsersModule } from 'src/amec/users/users.module';
import { FormmstModule } from '../formmst/formmst.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { FlowRepository } from './flow.repository';
import { ShowFlowService } from './show-flow.service';
import { DoactionFlowService } from './doaction.service';
import { DeleteFlowStepService } from './delete-flow-step.service';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FLOW], 'webformConnection'),
        RepModule,
        MailModule,
        forwardRef(() => FormModule),
        FormmstModule,
        UsersModule,
    ],
    controllers: [FlowController],
    providers: [
        FlowService,
        FlowRepository,
        ShowFlowService,
        DoactionFlowService,
        DeleteFlowStepService,
    ],
    exports: [
        FlowService,
        ShowFlowService,
        DoactionFlowService,
        DeleteFlowStepService,
    ],
})
export class FlowModule {}
