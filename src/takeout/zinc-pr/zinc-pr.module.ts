import { Module } from '@nestjs/common';
import { ZincPrService } from './zinc-pr.service';
import { ZincPrController } from './zinc-pr.controller';
import { ZincPrRepository } from './zinc-pr.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { ZincPrAs400Repository } from './zinc-pr-as400.repository';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
  imports: [ConectionModule, MailModule],
  controllers: [ZincPrController],
  providers: [ZincPrService, ZincPrRepository, ZincPrAs400Repository],
})
export class ZincPrModule {}
