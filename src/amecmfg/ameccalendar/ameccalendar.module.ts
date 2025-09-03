import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmeccalendarService } from './ameccalendar.service';
import { AmeccalendarController } from './ameccalendar.controller';
import { Ameccalendar } from './entities/ameccalendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ameccalendar], 'webformConnection')],
  controllers: [AmeccalendarController],
  providers: [AmeccalendarService],
  exports: [AmeccalendarService],
})
export class AmeccalendarModule {}
