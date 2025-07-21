import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TmaintaintypeService } from './tmaintaintype.service';
import { Tmaintaintype } from './entities/tmaintaintype.entity';
import { TmaintaintypeController } from './tmaintaintype.controller';

@Module({
  controllers: [TmaintaintypeController],
  imports: [
    TypeOrmModule.forFeature([Tmaintaintype], 'amecConnection')
  ],
  providers: [TmaintaintypeService],
})
export class TmaintaintypeModule {}
