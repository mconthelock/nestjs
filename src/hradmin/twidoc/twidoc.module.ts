import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwidocService } from './twidoc.service';
import { TwidocController } from './twidoc.controller';
import { JobTwiController } from './jobtwi.controller';
import { MasterkeyModule } from '../masterkey/masterkey.module';
import { DatabaseService } from '../shared/database.service';
import { MailModule } from 'src/common/services/mail/mail.module';
import { Masterkey } from '../masterkey/entities/masterkey.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Masterkey], 'datacenterConnection'),
        MasterkeyModule,
        MailModule,
    ],
    controllers: [TwidocController, JobTwiController],
    providers: [TwidocService, DatabaseService],
})
export class TwidocModule {}
