import { Module } from '@nestjs/common';
import { JopPurConfService } from './jop-pur-conf.service';
import { JopPurConfController } from './jop-pur-conf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JopPurConf } from './entities/jop-pur-conf.entity';
import { AmeccalendarModule } from 'src/amecmfg/ameccalendar/ameccalendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JopPurConf], 'amecConnection'),
    AmeccalendarModule,
  ],
  controllers: [JopPurConfController],
  providers: [JopPurConfService],
  exports: [JopPurConfService],
})
export class JopPurConfModule {}
