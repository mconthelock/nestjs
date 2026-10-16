import { Module } from '@nestjs/common';
import { CmSmService } from './cm-sm.service';
import { CmSmController } from './cm-sm.controller';
import { CmSmRepository } from './cm-sm.repository';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [CmSmController],
    providers: [CmSmService, CmSmRepository],
})
export class CmSmModule {}
