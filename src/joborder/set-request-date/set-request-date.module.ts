
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetRequestDateService } from './set-request-date.service';
import { SetRequestDateController } from './set-request-date.controller';
import { SetRequestDate } from './entities/set-request-date.entity';
import { AmeccalendarModule } from '../../amecmfg/ameccalendar/ameccalendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SetRequestDate], 'amecConnection'),
    AmeccalendarModule
  ],
  controllers: [SetRequestDateController],
  providers: [SetRequestDateService],
  exports: [SetRequestDateService], // ถ้าต้องการให้ service นี้สามารถใช้ได้ในโมดูลอื่น ๆ
})
export class SetRequestDateModule {}
