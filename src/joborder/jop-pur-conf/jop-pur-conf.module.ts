import { Module } from '@nestjs/common';
import { JopPurConfService } from './jop-pur-conf.service';
import { JopPurConfController } from './jop-pur-conf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JopPurConf } from './entities/jop-pur-conf.entity';
import { AmeccalendarModule } from 'src/amecmfg/ameccalendar/ameccalendar.module';
import { JopMarReqModule } from '../jop-mar-req/jop-mar-req.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JopPurConf], 'amecConnection'),
    AmeccalendarModule,
    JopMarReqModule,
  ],
  controllers: [JopPurConfController],
  providers: [JopPurConfService],
  exports: [JopPurConfService],
})
export class JopPurConfModule {}
