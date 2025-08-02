import { Module } from '@nestjs/common';
import { JopMarReqService } from './jop-mar-req.service';
import { JopMarReqController } from './jop-mar-req.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JopMarReq } from './entities/jop-mar-req.entity';
import { AmeccalendarModule } from 'src/amecmfg/ameccalendar/ameccalendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JopMarReq], 'amecConnection'),
    AmeccalendarModule,
  ],
  controllers: [JopMarReqController],
  providers: [JopMarReqService],
  exports: [JopMarReqService],
})
export class JopMarReqModule {}
