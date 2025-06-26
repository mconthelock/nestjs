import { Module } from '@nestjs/common';
import { AmeccalendarModule } from './ameccalendar/ameccalendar.module';

@Module({
  imports: [AmeccalendarModule],
})
export class AmecMfgModule {}
