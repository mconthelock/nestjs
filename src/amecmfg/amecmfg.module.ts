import { Module } from '@nestjs/common';
import { AmeccalendarModule } from './ameccalendar/ameccalendar.module';
import { AvmModule } from './avm/avm.module';

@Module({
  imports: [AmeccalendarModule, AvmModule],
})
export class AmecMfgModule {}
