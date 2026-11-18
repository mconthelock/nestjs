import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmeccalendarService } from './ameccalendar.service';
import { AmeccalendarController } from './ameccalendar.controller';
import { Ameccalendar } from './entities/ameccalendar.entity';
import { AmeccalendarRepository } from './ameccalendar.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Ameccalendar], 'datacenterConnection')],
    controllers: [AmeccalendarController],
    providers: [AmeccalendarService, AmeccalendarRepository],
    exports: [AmeccalendarService],
})
export class AmeccalendarModule {}
