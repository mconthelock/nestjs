import { Module } from '@nestjs/common';
import { CmSmService } from './cm-sm.service';
import { CmSmController } from './cm-sm.controller';
import { CmSmRepository } from './cm-sm.repository';
import { MailModule } from 'src/common/services/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DTIH } from 'src/common/Entities/daiyltech/table/DTIH.entity';
import { CM_SM_FORM } from 'src/common/Entities/daiyltech/table/CM_SM_FORM.entity';
import { LOG_INFO_TIMEL } from '../../common/Entities/daiyltech/table/LOG_INFO_TIMEL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        DTIH,
        CM_SM_FORM,
        LOG_INFO_TIMEL,
    ], 'mitsuConnection'),MailModule],
    controllers: [CmSmController],
    providers: [CmSmService, CmSmRepository],
})
export class CmSmModule {}
