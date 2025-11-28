import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entities/flow.entity';
import { RepModule } from '../rep/rep.module';
import { FormModule } from '../form/form.module';
import { UsersModule } from 'src/amec/users/users.module';
import { FormmstModule } from '../formmst/formmst.module';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flow], 'webformConnection'),
    RepModule,
    MailModule,
    forwardRef(() => FormModule),
    FormmstModule,
    UsersModule,
  ],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
