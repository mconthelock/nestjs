import { Module } from '@nestjs/common';
import { PromoteService } from './promote.service';
import { PromoteController } from './promote.controller';
import { MasterkeyModule } from '../masterkey/masterkey.module';
import { DatabaseService } from '../shared/database.service';
import { JobpromoteController } from './jobpromote.controller';
import { MailModule } from 'src/common/services/mail/mail.module';
@Module({
    imports: [MasterkeyModule, MailModule],
    controllers: [PromoteController, JobpromoteController],
    providers: [PromoteService, DatabaseService],
})
export class PromoteModule {}
