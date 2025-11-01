import { Module } from '@nestjs/common';
import { AmeccalendarModule } from './ameccalendar/ameccalendar.module';
import { AvmModule } from './avm/avm.module';
import { LockPisModule } from './lock-pis/lock-pis.module';
import { IdtagModule } from './idtag/idtag.module';

@Module({
  imports: [AmeccalendarModule, AvmModule, LockPisModule, IdtagModule],
})
export class AmecMfgModule {}
